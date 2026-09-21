# AI_CAPABILITIES_ROADMAP.md

**Project:** Isometric Agent Workspace  
**Target Environment:** aistudio.google.com / Gemini API-compatible implementation  
**Document Version:** 1.0.0  
**Prepared Date:** 2026-06-02  
**Primary Build Priority:** Phase 2 — Conversational Head Agent Command Center  
**Status:** Phase 1 completed / Phase 2 next / Phase 3 and Phase 4 gated  

---

## Executive Summary

This roadmap defines the production path for expanding the isometric agent workspace from animated agent behavior into a controllable AI operations environment. The immediate priority is **Phase 2**, because the Head Agent command loop unlocks natural-language workspace control, function calling, safe state mutation, audit logging, and later diagnostic automation.

Before moving into diagnostics or TTS, the system must add a shared validation layer. That validation layer is mandatory because model output must be treated as a proposal, not as trusted executable state.

---

## Build Priority Order

1. **Phase 1: Intelligent Status & Thought Broadcasts** — Completed; harden and keep stable.
2. **Phase 2: Conversational Head Agent Command Center** — Build next.
3. **Shared Validation Layer** — Must be built alongside Phase 2 before Phase 3 or Phase 4.
4. **AI System Health Debug Panel** — Add during Phase 2 so model behavior is observable.
5. **Phase 3: Root Cause Diagnostics & Code Evaluation** — Start only after Phase 2 is stable.
6. **Phase 4: Audible System Alerts** — Do not start until command routing and diagnostics are stable.

---

## Non-Negotiable Engineering Rules

- Do not hardcode model IDs throughout the app.
- Use model aliases in one configuration file.
- Validate all AI outputs before changing state.
- Treat Gemini Function Calling as a command proposal layer, not an execution layer.
- Never expose API keys in frontend/client-side code for a production deployment.
- Add timeouts, fallbacks, and safe failure states for every model call.
- Do not start TTS until command routing, diagnostics, incident severity, cooldowns, transcripts, and mute controls are reliable.
- Every command that mutates many agents or resets state must require confirmation.
- Every command mutation must be auditable.
- Every model failure must degrade gracefully without breaking the simulation.

---

## Model Alias Configuration

Use aliases so the app can swap underlying Gemini model IDs without rewriting feature code.

```ts
export const AI_MODEL_ALIASES = {
  MODEL_STATUS_BROADCAST: process.env.MODEL_STATUS_BROADCAST ?? "gemini-status-model",
  MODEL_COMMAND_ROUTER: process.env.MODEL_COMMAND_ROUTER ?? "gemini-command-router-model",
  MODEL_DIAGNOSTIC_ENGINE: process.env.MODEL_DIAGNOSTIC_ENGINE ?? "gemini-diagnostic-model",
  MODEL_TTS_ALERTS: process.env.MODEL_TTS_ALERTS ?? "gemini-tts-model",
} as const;
```

---

# Phase 1: Intelligent Status & Thought Broadcasts [COMPLETED / HARDENING]

Integration with a Gemini-compatible model alias for contextual agent thoughts, health alerts, support messages, patrol observations, and Command Unit chatbot memory.

## Step 1: Stabilize Agent Thought Generation

### 1.1 Define thought types
- Health alert
- Patrol reflection
- Supportive assist message
- System report
- Idle environmental observation

### 1.2 Create a thought schema
- `agentId`
- `agentRole`
- `thoughtType`
- `priority`
- `message`

### 1.3 Add validation
- Reject empty messages
- Reject messages over max length
- Reject malformed role output
- Normalize priority values
- Sanitize unsafe HTML/content

### 1.4 Add role-specific tone
- Monitor agents speak clinically
- Assist agents speak supportively
- Random agents speak observantly
- Linear agents speak procedurally
- Command Unit speaks authoritatively

### 1.5 Store recent thought history
- Keep last 20 thoughts per agent
- Keep last 100 global thoughts
- Prevent repeated messages
- Track timestamps
- Expose history to the chatbot context

## Step 2: Improve Broadcast Timing Logic

### 2.1 Add interval tiers
- Normal state interval
- Warning state interval
- Critical state interval
- Recovery state interval
- Idle state interval

### 2.2 Prevent broadcast spam
- Add cooldown per agent
- Add cooldown per thought type
- Deduplicate similar thoughts
- Suppress low-value idle thoughts
- Prioritize critical health messages

### 2.3 Add adaptive frequency
- Increase frequency during incidents
- Decrease frequency during stable state
- Pause when simulation is stopped
- Resume when activity changes
- Randomize timing slightly for realism

### 2.4 Add workspace-level throttling
- Cap global broadcasts per minute
- Cap critical alerts separately
- Queue lower-priority messages
- Drop stale messages
- Preserve latest critical state

### 2.5 Add user-configurable broadcast mode
- Silent
- Minimal
- Normal
- Verbose
- Diagnostic

## Step 3: Add Agent Memory Context

### 3.1 Track agent state memory
- Previous health
- Previous task
- Previous location
- Previous support target
- Previous alert level

### 3.2 Track behavioral continuity
- Avoid abrupt personality shifts
- Reference recent patrols
- Reference repeated problems
- Acknowledge recovery events
- Maintain role consistency

### 3.3 Add local memory windows
- Recent self thoughts
- Nearby agent events
- Current workspace incidents
- Current command state
- Current system mode

### 3.4 Feed memory into prompt context
- Keep context compact
- Use structured JSON
- Avoid entire app dumps
- Include only relevant fields
- Strip sensitive/debug-only data

### 3.5 Add reset controls
- Reset one agent memory
- Reset all agent thoughts
- Clear chatbot memory
- Preserve system state
- Confirm destructive resets

## Step 4: Refine Monitor Agent Health Alerts

### 4.1 Define health bands
- Healthy
- Degraded
- Warning
- Critical
- Offline

### 4.2 Add health transition messages
- Healthy to warning
- Warning to critical
- Critical to recovery
- Recovery to stable
- Stable to idle

### 4.3 Add pattern awareness
- Multiple agents degraded
- One agent repeatedly failing
- Area-specific overload
- Support bottleneck
- Patrol route blockage

### 4.4 Add alert severity labels
- Info
- Advisory
- Warning
- Critical
- Emergency

### 4.5 Add monitor terminal output
- Timestamped alerts
- Related agent IDs
- Cause hypothesis
- Recommended action
- Escalation status

## Step 5: Refine Assist Agent Support Messages

### 5.1 Detect support opportunities
- Nearby damaged agent
- Critical health agent
- Stalled agent
- Command-requested support
- Repeated failure pattern

### 5.2 Generate supportive text
- Short reassurance
- Current action
- Target agent reference
- Expected outcome
- Escalation hint if needed

### 5.3 Add support action states
- Moving to target
- Assisting
- Healing
- Waiting
- Complete

### 5.4 Improve healing feedback
- Show health delta
- Show estimated recovery
- Show assist source
- Show success/failure
- Show next recommendation

### 5.5 Add assist limits
- Max concurrent assists
- Cooldown after assist
- Range limitations
- Priority override
- Manual command override

## Step 6: Refine Patrol Agent Reflections

### 6.1 Add route-aware messages
- Mention current zone
- Mention route progress
- Mention obstacles
- Mention idle patrol state
- Mention abnormal movement

### 6.2 Add environment awareness
- Agent density
- Local health averages
- Nearby monitor activity
- Recent incidents
- Workspace load

### 6.3 Add personality boundaries
- Professional tone
- No hallucinated features
- No false system claims
- No excessive emotion
- No repeated catchphrases

### 6.4 Add patrol summary events
- Route started
- Route midpoint
- Route completed
- Route interrupted
- Route reassigned

### 6.5 Add patrol debug metadata
- Current waypoint
- Next waypoint
- Movement state
- Collision state
- Route age

## Step 7: Expand Command Unit Chatbot Context

### 7.1 Persist user identity
- Name
- Preferred command style
- Recent instruction patterns
- UI mode preference
- Last active session summary

### 7.2 Add workspace context
- Active agents
- Health summary
- Current incidents
- Recent commands
- Current simulation mode

### 7.3 Add chatbot memory boundaries
- Store useful preferences
- Avoid storing transient noise
- Reset on user request
- Separate user memory from agent memory
- Show memory status in UI

### 7.4 Add system-aware answers
- Explain current state
- Summarize recent incidents
- Recommend next action
- Identify overloaded agents
- Suggest command shortcuts

### 7.5 Add chatbot safety
- Refuse unsupported mutations
- Ask for confirmation on destructive actions
- Never invent hidden system state
- Cite visible state when possible
- Log command attempts

## Step 8: Add Prompt Governance

### 8.1 Create prompt templates
- Status broadcast prompt
- Monitor alert prompt
- Assist message prompt
- Patrol reflection prompt
- Command Unit context prompt

### 8.2 Add strict output format
- JSON-only where needed
- No markdown for machine actions
- No hidden chain-of-thought
- Include brief rationale summary
- Include confidence score

### 8.3 Add prompt versioning
- Version each template
- Store changelog
- Record active prompt version
- Track failure rates
- Enable rollback

### 8.4 Add prompt test cases
- Healthy workspace
- Critical agent
- Multiple failures
- Idle state
- Command conflict

### 8.5 Add prompt failure handling
- Retry once
- Fall back to template message
- Mark output invalid
- Log model error
- Keep simulation running

## Step 9: Add UI Presentation Polish

### 9.1 Improve thought bubbles
- Role icon
- Priority color
- Fade animation
- Compact mode
- Expanded detail mode

### 9.2 Add terminal feed
- Latest broadcasts
- Critical alerts
- Command results
- Diagnostic summaries
- Audio alert events

### 9.3 Add agent inspector panel
- Current thought
- Recent history
- Current task
- Health trend
- AI status

### 9.4 Add broadcast controls
- Pause
- Resume
- Clear
- Filter by role
- Filter by severity

### 9.5 Add accessibility support
- Reduced motion mode
- Screen-reader labels
- High contrast states
- Keyboard navigation
- Non-audio alert fallback

## Step 10: Complete Phase 1 Verification

### 10.1 Add smoke tests
- Thought generation works
- Invalid output is rejected
- Broadcast cooldown works
- Chatbot remembers name
- Critical alerts render

### 10.2 Add state tests
- Health changes trigger messages
- Idle state suppresses spam
- Recovery state updates correctly
- Duplicate thoughts are blocked
- History caps correctly

### 10.3 Add UI tests
- Thought bubble appears
- Terminal feed updates
- Agent inspector opens
- Filters work
- Reduced motion works

### 10.4 Add logging
- Model request started
- Model response received
- Validation failed
- Broadcast emitted
- Fallback used

### 10.5 Define completion criteria
- No broadcast spam
- No malformed thoughts
- No client crash on model error
- Chatbot context remains accurate
- Agent roles feel distinct

---

# Phase 2: Conversational Head Agent Command Center [BUILD NEXT]

Users converse with the Head Agent to command the workspace. Natural-language commands are interpreted through Gemini Function Calling and converted into controlled workspace state mutations.

## Phase 2 Success Criteria

Phase 2 is complete when:

- The user can issue natural-language commands to the Head Agent.
- Gemini Function Calling can propose structured commands.
- All command proposals are validated before execution.
- Mutations are routed through a safe state mutation queue.
- Broad/destructive/high-impact commands require confirmation.
- All command attempts are recorded in an audit trail.
- The AI System Health debug panel displays operational metrics.
- Model failures degrade into safe fallback responses.
- No malformed model output can crash the app.
- No command can mutate state without passing guards.

## Step 1: Define Command Taxonomy

### 1.1 Create command categories
- Movement
- Assistance
- Broadcast
- Diagnostics
- System mode

### 1.2 Define command intent names
- `sendAgentToTarget`
- `assignAssistMission`
- `setBroadcastMode`
- `runDiagnostic`
- `summarizeWorkspace`

### 1.3 Define supported targets
- Single agent
- Agent role group
- All agents
- Zone/area
- Current incident cluster

### 1.4 Define command priority
- Low
- Normal
- High
- Critical
- Manual override

### 1.5 Define unsupported commands
- Destructive reset without confirmation
- Hidden state mutation
- Unsafe infinite loop
- Unavailable feature call
- Ambiguous multi-target mutation

## Step 2: Build Function Calling Contracts

### 2.1 Create function declarations
- Name
- Description
- Parameters
- Required fields
- Allowed enum values

### 2.2 Add movement function
- Agent ID
- Destination
- Reason
- Priority
- Confirmation requirement

### 2.3 Add assist function
- Assisting agent
- Target agent
- Support type
- Duration estimate
- Escalation policy

### 2.4 Add broadcast function
- Broadcast mode
- Agent scope
- Duration
- Severity filter
- User-visible reason

### 2.5 Add diagnostic function
- Diagnostic scope
- Trigger reason
- Data window
- Output format
- Include recommendations flag

## Step 3: Create Command Parser Layer

### 3.1 Normalize user text
- Trim whitespace
- Preserve names
- Detect commands
- Detect questions
- Detect confirmations

### 3.2 Extract entities
- Agent names
- Agent roles
- Zones
- System modes
- Severity terms

### 3.3 Resolve aliases
- Coder agent
- Monitor agent
- Assist unit
- Head Agent
- Command Unit

### 3.4 Detect ambiguity
- Multiple possible agents
- Missing target
- Conflicting action
- Unsupported role
- Unclear priority

### 3.5 Generate clarification prompts
- Ask one focused question
- Offer valid options
- Show current state
- Preserve user intent
- Avoid blocking obvious commands

## Step 4: Add Safe State Mutation Layer

### 4.1 Create mutation queue
- Enqueue command
- Validate command
- Apply command
- Emit result
- Store audit log

### 4.2 Add mutation guards
- Agent exists
- Target exists
- Action allowed
- State not locked
- Cooldown respected

### 4.3 Add confirmation gates
- Reset commands
- All-agent commands
- Critical override
- Diagnostic storm prevention
- Audio alert mode changes

### 4.4 Add rollback support
- Capture previous state
- Revert failed mutation
- Restore previous mode
- Log rollback reason
- Notify user

### 4.5 Add command result object
- Success flag
- Applied changes
- Rejected changes
- Reason
- Next suggested action

## Step 5: Build Head Agent Conversation UI

### 5.1 Add command chat panel
- Input box
- Send button
- Command history
- Function call preview
- Execution result card

### 5.2 Add command suggestions
- “Send Assist to weakest agent”
- “Run diagnostics”
- “Set broadcast to minimal”
- “Summarize workspace”
- “Pause all movement”

### 5.3 Add command confirmation UI
- Proposed action
- Affected agents
- Risk level
- Confirm button
- Cancel button

### 5.4 Add command feedback
- Success message
- Rejection reason
- Partial completion
- Clarification request
- Recovery suggestion

### 5.5 Add keyboard support
- Enter to send
- Shift+Enter newline
- Escape cancel
- Arrow command history
- Focus trap in modal

## Step 6: Add Workspace-Aware Command Context

### 6.1 Provide current state
- Agent list
- Health summary
- Active incidents
- Current mode
- Recent user commands

### 6.2 Provide available actions
- Movement commands
- Assist commands
- Broadcast commands
- Diagnostic commands
- Audio commands

### 6.3 Provide constraints
- Locked agents
- Cooldowns
- Current tasks
- Critical states
- Unsupported actions

### 6.4 Provide recent failures
- Failed command
- Invalid target
- Model parse error
- Mutation rejection
- Confirmation timeout

### 6.5 Provide user preference context
- Preferred verbosity
- Last selected agent
- Command style
- Broadcast preference
- Audio preference

## Step 7: Add Command Execution Observability

### 7.1 Log command lifecycle
- User input received
- Function call selected
- Arguments generated
- Validation result
- Mutation result

### 7.2 Add command timeline
- Parsed
- Confirmed
- Queued
- Applied
- Completed

### 7.3 Add visible audit feed
- Command
- Actor
- Target
- Outcome
- Timestamp

### 7.4 Add developer debug view
- Raw function call
- Validation errors
- State diff
- Retry attempt
- Fallback path

### 7.5 Add telemetry counters
- Commands per session
- Parse success rate
- Clarification rate
- Mutation failure rate
- Average command latency

## Step 8: Add Natural Language Workspace Queries

### 8.1 Support state questions
- “Who is unhealthy?”
- “What changed recently?”
- “Which agent is overloaded?”
- “What mode are we in?”
- “What should I do next?”

### 8.2 Support agent questions
- “What is Monitor doing?”
- “Why is Coder stuck?”
- “Who needs help?”
- “Where is Assist going?”
- “What did Random report?”

### 8.3 Support incident questions
- “What caused this?”
- “Is this getting worse?”
- “Has this happened before?”
- “What is the likely bottleneck?”
- “Should I escalate?”

### 8.4 Support command previews
- “What would happen if I reset?”
- “Can you send all agents?”
- “Who would be affected?”
- “Is this safe?”
- “What are my options?”

### 8.5 Support summaries
- Current session summary
- Last 5 minutes summary
- Critical event summary
- Agent role summary
- Recommended action summary

## Step 9: Add Error Handling and Fallbacks

### 9.1 Handle model failure
- Show fallback message
- Do not mutate state
- Retry only safe calls
- Preserve user input
- Log failure

### 9.2 Handle invalid function output
- Reject bad JSON
- Reject missing fields
- Reject unknown tools
- Ask clarification
- Use deterministic fallback

### 9.3 Handle unsupported intent
- Explain limitation
- Offer closest supported command
- Do not fake capability
- Store feature request
- Keep conversation open

### 9.4 Handle conflicting command
- Identify conflict
- Show affected state
- Ask user to choose
- Suggest safest option
- Block automatic mutation

### 9.5 Handle command overload
- Queue commands
- Prioritize critical commands
- Drop duplicate commands
- Show queue status
- Allow cancellation

## Step 10: Complete Phase 2 Verification

### 10.1 Add command tests
- Valid movement command
- Valid assist command
- Valid broadcast command
- Ambiguous command
- Unsupported command

### 10.2 Add function call tests
- Correct function selected
- Required args present
- Enum values valid
- Bad args rejected
- Confirmation required when needed

### 10.3 Add mutation tests
- State updates correctly
- Rollback works
- Cooldown enforced
- Locked state protected
- Audit log created

### 10.4 Add UI tests
- Command submits
- Confirmation appears
- Result card renders
- Error state renders
- Command history works

### 10.5 Define completion criteria
- Head Agent can safely mutate state
- Ambiguous commands do not break app
- Function calls are validated before execution
- User sees what changed
- All critical mutations are auditable

---

# Shared Validation Layer [MANDATORY BEFORE PHASE 3 OR PHASE 4]

This layer must be built during Phase 2 and reused by diagnostics and TTS.

## Step 1: JSON Schema Validation

### 1.1 Define schemas
- Thought schema
- Command schema
- Diagnostic schema
- Audio alert schema
- Audit log schema

### 1.2 Validate model output
- Parse JSON safely
- Reject malformed JSON
- Reject missing fields
- Reject unexpected enum values
- Reject oversized payloads

### 1.3 Add typed results
- `Valid<T>`
- `Invalid`
- `ValidationError`
- `FallbackResult`
- `CommandResult`

### 1.4 Add schema test cases
- Valid output
- Missing required property
- Wrong enum
- Extra unsafe field
- Oversized message

### 1.5 Add validation logging
- Schema name
- Failure reason
- Raw output hash
- Safe excerpt
- Fallback used

## Step 2: Command Mutation Guards

### 2.1 Verify command actor
- User command
- Head Agent command
- System diagnostic command
- Recovery automation command
- Manual override command

### 2.2 Verify command scope
- Single agent
- Role group
- All agents
- Workspace mode
- Incident cluster

### 2.3 Verify command permission
- Read-only command
- Low-impact mutation
- High-impact mutation
- Destructive mutation
- Confirmation-required mutation

### 2.4 Verify command state
- Agent exists
- Agent not locked
- Target exists
- Workspace not paused
- Cooldown not active

### 2.5 Verify command result
- Mutation applied
- Mutation rejected
- Mutation queued
- Mutation rolled back
- Mutation requires confirmation

## Step 3: AI Output Sanitization

### 3.1 Sanitize text
- Strip HTML
- Escape unsafe characters
- Limit length
- Normalize whitespace
- Block script-like output

### 3.2 Sanitize command arguments
- Trim strings
- Enforce enum values
- Clamp numbers
- Reject unknown object keys
- Reject nested unsafe payloads

### 3.3 Sanitize terminal output
- No raw secrets
- No raw stack dumps by default
- No full prompt dumps
- No hidden chain-of-thought
- No excessive verbosity

### 3.4 Sanitize audio scripts
- No secrets
- No raw logs
- No private memory
- No long diagnostic dump
- No repeated alert spam

### 3.5 Sanitize export payloads
- Strip API keys
- Strip private memory
- Strip unnecessary raw input
- Include safe reproduction data
- Include safe technical summary

## Step 4: Model Timeout Handling

### 4.1 Set default timeouts
- Status broadcast timeout
- Command router timeout
- Diagnostic timeout
- TTS timeout
- Export summary timeout

### 4.2 Add abort behavior
- Abort controller
- Clear pending state
- Mark request failed
- Use fallback
- Log timeout

### 4.3 Add retry rules
- Retry only idempotent calls
- Do not retry destructive commands
- Retry once by default
- Add jitter
- Stop on validation failure

### 4.4 Add UI behavior
- Show pending state
- Show timeout message
- Keep user input
- Do not mutate state
- Offer manual retry

### 4.5 Add metrics
- Last latency
- Average latency
- Timeout count
- Retry count
- Fallback count

## Step 5: Fallback Responses

### 5.1 Add command fallback
- “I could not safely parse that command.”
- “No state changes were made.”
- “Try one of these supported commands.”
- “Select a target agent.”
- “Confirm before applying this change.”

### 5.2 Add broadcast fallback
- “Agent status update unavailable.”
- “Monitor alert generated locally.”
- “Broadcast temporarily paused.”
- “Using static health message.”
- “Thought generation recovered.”

### 5.3 Add diagnostic fallback
- “Diagnostic unavailable.”
- “Rule-based scan completed.”
- “Insufficient evidence.”
- “Human review recommended.”
- “Retry diagnostic after state changes.”

### 5.4 Add audio fallback
- “Audio unavailable.”
- “Visual alert shown instead.”
- “Transcript generated.”
- “Muted by preference.”
- “TTS skipped due to cooldown.”

### 5.5 Add fallback observability
- Fallback type
- Trigger reason
- Related feature
- User-visible message
- Recovery path

---

# AI System Health Debug Panel [ADD DURING PHASE 2]

The debug panel gives developers and advanced users visibility into the AI layer.

## Required Metrics

- Active model alias
- Last model latency
- Failed model calls
- Command parse success rate
- Broadcast queue length
- Audio queue length

## Recommended Additional Metrics

- Last command received
- Last function selected
- Last validation error
- Mutation queue length
- Pending confirmation count
- Fallback count
- Timeout count
- Average diagnostic latency
- Current broadcast mode
- Audio mode

## UI Placement

Place the panel in a collapsible debug drawer, top-right or bottom-right, separate from the main Head Agent chat. It should not distract normal users, but it should be accessible during development.

## Panel States

### Healthy
- Model calls completing
- Low queue depth
- No recent validation failures
- Normal command success rate
- No active timeouts

### Warning
- Some model failures
- Increased latency
- Repeated fallback use
- Queue depth rising
- Validation errors appearing

### Critical
- Model unavailable
- Command parsing failing
- Mutation queue blocked
- Broadcast queue overflowing
- TTS queue disabled

## Debug Panel Data Contract

```ts
export interface AISystemHealthSnapshot {
  activeModelAlias: {
    statusBroadcast: string;
    commandRouter: string;
    diagnosticEngine: string;
    ttsAlerts: string;
  };
  lastModelLatencyMs: number | null;
  failedModelCalls: number;
  commandParseSuccessRate: number;
  broadcastQueueLength: number;
  audioQueueLength: number;
  mutationQueueLength: number;
  fallbackCount: number;
  timeoutCount: number;
  lastValidationError?: string;
  lastUpdatedAt: string;
}
```

---

# Phase 3: Root Cause Diagnostics & Code Evaluation [PLANNED / GATED]

Do not start Phase 3 until Phase 2 and the Shared Validation Layer are stable.

## Phase 3 Entry Criteria

- Head Agent command routing works.
- Function call proposals are validated.
- Mutation queue is stable.
- Audit trail is active.
- AI System Health debug panel is visible.
- Fallback responses are implemented.
- Diagnostic packet sanitization exists.

## Step 1: Define Diagnostic Trigger Conditions

### 1.1 Health-based triggers
- Multiple agents below threshold
- One agent repeatedly degrading
- Sudden health drop
- Failed recovery attempt
- Long critical state

### 1.2 Movement-based triggers
- Agent stuck
- Repeated path failure
- Collision loop
- Patrol interruption
- Route timeout

### 1.3 Command-based triggers
- Repeated failed command
- Conflicting user commands
- Invalid function call pattern
- Mutation rollback
- Command queue buildup

### 1.4 Broadcast-based triggers
- Too many critical alerts
- Repeated identical alert
- Monitor overload
- Silent critical state
- Broadcast suppression conflict

### 1.5 System-based triggers
- Render slowdown
- State update lag
- API failure spike
- Audio queue backlog
- Memory/history growth

## Step 2: Create Diagnostic Data Packet

### 2.1 Include agent state
- Agent ID
- Role
- Health
- Current task
- Current location

### 2.2 Include recent events
- Health changes
- Commands
- Alerts
- Movement events
- Support events

### 2.3 Include system metrics
- FPS estimate
- Render loop timing
- Model latency
- Queue size
- Error count

### 2.4 Include environment context
- Active mode
- Broadcast setting
- Number of agents
- Current incident count
- User command history

### 2.5 Exclude unsafe data
- API keys
- Raw secrets
- Full user private memory
- Unneeded logs
- Large payload dumps

## Step 3: Build Diagnostic Prompt Template

### 3.1 Define AI role
- Senior systems engineer
- Incident responder
- Simulation architect
- Frontend performance analyst
- Agent orchestration reviewer

### 3.2 Require structured output
- Summary
- Likely root cause
- Evidence
- Recommended fix
- Confidence level

### 3.3 Add constraint rules
- Do not invent state
- Use only supplied packet
- Mark unknowns clearly
- Prefer actionable fixes
- Keep terminal output concise

### 3.4 Add severity scoring
- Low
- Medium
- High
- Critical
- Unknown

### 3.5 Add remediation format
- Immediate action
- Short-term fix
- Long-term fix
- Preventive rule
- Verification step

## Step 4: Add Root Cause Analysis Terminal

### 4.1 Create RCA terminal panel
- Incident title
- Severity badge
- Root cause summary
- Evidence list
- Recommended actions

### 4.2 Add incident timeline
- Trigger event
- Related alerts
- Agent state changes
- Commands issued
- Recovery attempts

### 4.3 Add action buttons
- Run recommended fix
- Assign Assist
- Change broadcast mode
- Pause movement
- Export diagnostic

### 4.4 Add confidence indicators
- High confidence
- Medium confidence
- Low confidence
- Insufficient evidence
- Needs human review

### 4.5 Add terminal history
- Previous RCA reports
- Resolved incidents
- Reopened incidents
- False positives
- Manual notes

## Step 5: Add Code Evaluation Capability

### 5.1 Define code evaluation scope
- Current component state logic
- Agent behavior functions
- Command mutation handlers
- Prompt templates
- Performance-critical loops

### 5.2 Add safe code packet
- Relevant function snippets
- Error logs
- State schema
- Recent failure
- User-visible symptom

### 5.3 Ask model for review
- Bug hypothesis
- Edge case risk
- Performance issue
- State consistency issue
- Suggested patch direction

### 5.4 Keep output non-destructive
- No automatic code rewrite
- No hidden patching
- No unsafe eval
- No executing model-generated code
- Human approval required

### 5.5 Add patch recommendation view
- Problem
- Suggested change
- Files affected
- Risk level
- Test to run

## Step 6: Build Specialist Agent Roles

### 6.1 Monitor engineer
- Detects health anomalies
- Flags incident severity
- Watches repeated failures
- Reports escalation need
- Summarizes system health

### 6.2 Performance engineer
- Watches render latency
- Detects excessive updates
- Flags animation overload
- Suggests batching
- Recommends memoization

### 6.3 Command engineer
- Watches function calls
- Detects bad arguments
- Flags unsafe mutations
- Suggests better schemas
- Reviews command failure rate

### 6.4 Recovery engineer
- Assigns assist strategy
- Suggests stabilization
- Tracks recovery success
- Escalates unresolved cases
- Recommends safe rollback

### 6.5 UX engineer
- Detects alert noise
- Flags unclear feedback
- Suggests interface improvements
- Reviews accessibility issues
- Improves command clarity

## Step 7: Add Automated Diagnostic Modes

### 7.1 Manual diagnostics
- User asks Head Agent
- User clicks diagnostic button
- User selects agent
- User selects incident
- User selects time window

### 7.2 Automatic diagnostics
- Health threshold trigger
- Pattern overload trigger
- Repeated failure trigger
- Command failure trigger
- Performance degradation trigger

### 7.3 Scheduled diagnostics
- Every 5 minutes
- On mode change
- On agent count change
- On broadcast setting change
- On session end

### 7.4 Lightweight diagnostics
- No model call
- Rule-based summary
- Fast health scan
- Local heuristics
- Low-cost recommendation

### 7.5 Deep diagnostics
- Model-assisted RCA
- Larger context packet
- Incident comparison
- Recommended fixes
- Exportable report

## Step 8: Add Diagnostic Memory

### 8.1 Store incidents
- Incident ID
- Trigger type
- Affected agents
- RCA summary
- Resolution status

### 8.2 Store recurring patterns
- Repeated stuck zones
- Repeated low-health agents
- Repeated command failures
- Repeated API errors
- Repeated render lag

### 8.3 Store fix outcomes
- Fix applied
- Fix success
- Fix failure
- Time to recovery
- Follow-up needed

### 8.4 Store false positives
- Trigger reason
- Why it was false
- Suppression rule
- Future adjustment
- Human note

### 8.5 Use memory in future RCA
- Compare similar incidents
- Reference prior fix
- Detect regression
- Improve confidence
- Recommend prevention

## Step 9: Add Export and Review Tools

### 9.1 Export formats
- Markdown
- JSON
- Plain text
- Terminal copy
- Debug packet

### 9.2 Add report fields
- Incident summary
- Root cause
- Evidence
- Actions taken
- Verification result

### 9.3 Add developer notes
- Manual annotation
- Suspected bug
- Test result
- Patch link
- Follow-up task

### 9.4 Add review workflow
- Mark unresolved
- Mark resolved
- Mark needs code fix
- Mark false positive
- Mark monitor-only

### 9.5 Add share-safe mode
- Strip secrets
- Strip private memory
- Strip raw user input if needed
- Keep technical summary
- Keep reproduction steps

## Step 10: Complete Phase 3 Verification

### 10.1 Add diagnostic trigger tests
- Low health cluster
- Stuck agent
- Failed command loop
- Alert spam
- Render lag

### 10.2 Add RCA output tests
- Structured output valid
- Evidence references supplied data
- Unknowns are labeled
- Severity is valid
- Recommendations are actionable

### 10.3 Add code evaluation tests
- Snippet packet builds
- Unsafe output blocked
- Patch recommendation renders
- Human approval required
- No automatic execution occurs

### 10.4 Add memory tests
- Incident stored
- Pattern detected
- False positive suppressed
- Prior fix referenced
- Export removes sensitive data

### 10.5 Define completion criteria
- RCA appears for real incident patterns
- Diagnostics do not spam model calls
- Terminal output is concise and useful
- Reports are exportable
- Recommendations include verification steps

---

# Phase 4: Audible System Alerts [PLANNED / GATED]

Do not start TTS until command routing and diagnostics are stable. Audio is valuable only after incident severity, cooldowns, transcripts, and mute controls are reliable.

## Phase 4 Entry Criteria

- Phase 2 command routing is stable.
- Phase 3 diagnostics are stable.
- Incident severity exists.
- Audio transcript storage exists.
- Cooldown rules exist.
- Mute controls exist.
- Visual fallback alerts exist.
- TTS scripts can be sanitized.

## Step 1: Define Audio Alert Policy

### 1.1 Define alert categories
- Critical health
- Recovery complete
- Diagnostic complete
- Command applied
- System warning

### 1.2 Define audible severity
- Silent
- Soft cue
- Spoken advisory
- Spoken warning
- Critical alert

### 1.3 Define user controls
- Audio on/off
- Critical only
- Voice style
- Volume
- Cooldown frequency

### 1.4 Define default behavior
- Audio disabled by default or minimal
- Critical alerts only
- No repeated spam
- Visual fallback always present
- User can mute immediately

### 1.5 Define accessibility behavior
- Captions
- Terminal transcript
- Visual pulse
- Screen-reader-compatible text
- Reduced sensory mode

## Step 2: Build TTS Request Layer

### 2.1 Create TTS function
- Input text
- Voice style
- Priority
- Alert type
- Correlation ID

### 2.2 Validate TTS text
- Max length
- No secrets
- No raw debug dumps
- No repeated text
- Clear human wording

### 2.3 Add TTS prompt format
- Short sentence
- Alert severity
- Calm tone
- No exaggerated emotion
- No unnecessary details

### 2.4 Add model configuration
- TTS model alias
- Voice config
- Output format
- Retry policy
- Timeout limit

### 2.5 Add response handling
- Decode audio
- Store blob URL
- Queue playback
- Log generation
- Handle failure

## Step 3: Add Audio Queue System

### 3.1 Create queue states
- Pending
- Generating
- Ready
- Playing
- Complete

### 3.2 Prioritize alerts
- Critical first
- Recovery second
- Command feedback third
- Advisory fourth
- Idle never by default

### 3.3 Add queue limits
- Max queue size
- Drop stale advisory
- Merge duplicate criticals
- Prevent overlapping speech
- Allow manual clear

### 3.4 Add playback controls
- Play
- Pause
- Stop
- Mute
- Replay latest

### 3.5 Add queue observability
- Queue length
- Current alert
- Last played
- Failed generation
- Cooldown status

## Step 4: Generate Dynamic Alert Scripts

### 4.1 Create critical templates
- “Critical health drop detected.”
- “Multiple agents require support.”
- “Monitor has detected overload.”
- “Recovery failed.”
- “Manual review recommended.”

### 4.2 Create recovery templates
- “Agent health has stabilized.”
- “Assist operation complete.”
- “System returned to normal.”
- “Incident resolved.”
- “No further action required.”

### 4.3 Create diagnostic templates
- “Root cause analysis complete.”
- “Likely cause identified.”
- “Diagnostic confidence is low.”
- “Human review recommended.”
- “Recommended action is available.”

### 4.4 Create command templates
- “Command applied.”
- “Command rejected.”
- “Confirmation required.”
- “Target unavailable.”
- “Action queued.”

### 4.5 Create fallback scripts
- Use static text if model fails
- Avoid blocking visual UI
- Keep alert short
- Mark as fallback
- Log reason

## Step 5: Add Audio UI Controls

### 5.1 Add audio status button
- Enabled
- Muted
- Critical only
- Generating
- Playing

### 5.2 Add audio settings panel
- Volume
- Alert mode
- Voice style
- Cooldown
- Test voice

### 5.3 Add transcript feed
- Spoken text
- Alert type
- Timestamp
- Related incident
- Replay button

### 5.4 Add visual equivalent
- Flashing border
- Terminal message
- Agent indicator
- Toast notification
- Incident badge

### 5.5 Add keyboard shortcuts
- Mute
- Replay latest
- Open audio settings
- Stop playback
- Toggle critical-only mode

## Step 6: Add Audio Safety and Consent

### 6.1 Require user enablement
- Do not auto-play before permission
- Show first-use explanation
- Respect browser autoplay policy
- Save preference
- Allow instant disable

### 6.2 Protect sensitive output
- Do not speak secrets
- Do not speak raw logs
- Do not speak personal memory
- Do not speak full diagnostic packet
- Use summarized messages only

### 6.3 Add noise controls
- Minimum interval
- Duplicate suppression
- Critical-only mode
- Quiet hours option
- Manual mute

### 6.4 Add environment awareness
- Mobile-friendly controls
- Headphone-safe volume
- Browser tab visibility
- User inactivity state
- Focus mode compatibility

### 6.5 Add compliance-friendly transcript
- Every spoken alert is logged
- User can review text
- User can delete history
- Export excludes audio by default
- Audio state is visible

## Step 7: Connect Audio to Incident Engine

### 7.1 Map triggers to audio
- Critical health event
- RCA completion
- Recovery completion
- Failed command
- Escalation needed

### 7.2 Add trigger filters
- Severity threshold
- Agent scope
- User preference
- Cooldown
- Duplicate check

### 7.3 Add incident correlation
- Audio alert ID
- Incident ID
- Agent IDs
- Trigger reason
- Result status

### 7.4 Add escalation cues
- First warning
- Second warning
- Critical escalation
- Recovery notice
- Human review notice

### 7.5 Add suppression rules
- Suppress during mute
- Suppress during quiet mode
- Suppress repeated same issue
- Suppress low-priority idle events
- Suppress while confirmation modal is open

## Step 8: Optimize TTS Latency

### 8.1 Use short scripts
- One sentence
- Under 15 words where possible
- Clear severity
- No filler
- No long summaries

### 8.2 Cache common alerts
- Static critical alert
- Static recovery alert
- Static command success
- Static command rejected
- Static confirmation required

### 8.3 Generate only when needed
- Avoid idle audio
- Avoid non-critical model calls
- Prefer cached audio
- Use fallback text
- Batch low-priority messages

### 8.4 Add timeout behavior
- Abort slow generation
- Use static fallback
- Do not block UI
- Log timeout
- Continue visual alert

### 8.5 Add performance metrics
- TTS request latency
- Playback delay
- Queue wait time
- Failure rate
- Cache hit rate

## Step 9: Add Testing for Audio Alerts

### 9.1 Test generation
- Valid alert text
- Invalid text rejected
- Long text trimmed
- Sensitive text blocked
- Fallback used on failure

### 9.2 Test playback
- Audio plays once
- Mute stops playback
- Replay works
- Queue advances
- Overlap prevented

### 9.3 Test accessibility
- Transcript appears
- Visual fallback appears
- Keyboard controls work
- Reduced sensory mode suppresses audio
- Screen-reader labels exist

### 9.4 Test incident integration
- Critical event queues audio
- Recovery queues audio
- Duplicate suppressed
- Quiet mode blocks audio
- Manual test alert works

### 9.5 Test browser behavior
- Autoplay permission handled
- Tab hidden behavior works
- Mobile controls work
- Audio object cleanup works
- Blob URLs revoked

## Step 10: Complete Phase 4 Verification

### 10.1 Define acceptance criteria
- Critical alerts can be spoken
- User can mute instantly
- Visual fallback always exists
- No repeated audio spam
- Audio never blocks simulation

### 10.2 Verify safety
- No secrets spoken
- No raw logs spoken
- No private memory spoken
- No unapproved autoplay
- No infinite queue

### 10.3 Verify performance
- TTS does not freeze UI
- Queue stays bounded
- Cached alerts reduce latency
- Failed audio degrades gracefully
- Blob cleanup prevents memory leaks

### 10.4 Verify UX quality
- Alerts are short
- Tone is calm
- Audio is useful, not annoying
- Controls are obvious
- Transcripts are readable

### 10.5 Define completion criteria
- Audio alerts work for critical incidents
- Audio settings persist
- Transcripts are logged
- Accessibility fallback is complete
- TTS failures do not break the app

---

# Build: Phase 2 Implementation Prompt for AI Studio

Paste this into AI Studio or the coding assistant connected to the project.

```text
You are upgrading an existing isometric AI agent workspace.

TASK:
Build Phase 2: Conversational Head Agent Command Center.

CONTEXT:
Phase 1 already exists with intelligent agent status/thought broadcasts, role-based messages, monitor alerts, assist messages, patrol reflections, and a persistent Command Unit chatbot.

PRIMARY OBJECTIVE:
Add a Head Agent command loop that allows the user to issue natural-language commands that are parsed through Gemini Function Calling, validated, routed through a safe mutation queue, applied to workspace state, and recorded in an audit trail.

CRITICAL RULES:
1. Analyze existing code first.
2. Generate missing files only.
3. Do not rewrite unrelated files.
4. Do not break existing Phase 1 thought broadcasts.
5. Do not add TTS yet.
6. Treat model output as untrusted.
7. Validate every function call before state mutation.
8. Add confirmation gates for all-agent, reset, pause-all, critical override, and destructive commands.
9. Add deterministic fallback responses for model errors, invalid JSON, invalid function arguments, timeouts, unsupported commands, and ambiguous commands.
10. Add the AI System Health debug panel.

REQUIRED FEATURES:
- Head Agent chat panel.
- Function calling contracts.
- Command parser.
- Safe mutation queue.
- Mutation guards.
- Confirmation modal.
- Command result cards.
- Audit feed.
- AI System Health debug panel.

REQUIRED SHARED VALIDATION LAYER:
- JSON schema validation.
- Command mutation guards.
- AI output sanitization.
- Model timeout handling.
- Fallback responses.

REQUIRED DEBUG PANEL METRICS:
- Active model alias.
- Last model latency.
- Failed model calls.
- Command parse success rate.
- Broadcast queue length.
- Audio queue length.
- Mutation queue length.
- Fallback count.
- Timeout count.
- Last validation error.

FUNCTION CALLING INTENTS:
- sendAgentToTarget
- assignAssistMission
- setBroadcastMode
- runDiagnostic
- summarizeWorkspace

COMMAND EXAMPLES:
- “Send the Assist agent to the weakest agent.”
- “Set all agents to minimal broadcast mode.”
- “What changed in the last five minutes?”
- “Pause all movement.”
- “Run a diagnostic on the monitor cluster.”
- “Summarize workspace health.”

EXPECTED FILES:
- src/ai/models.ts
- src/ai/schemas/command.schema.ts
- src/ai/schemas/aiSystemHealth.schema.ts
- src/ai/services/routeCommand.ts
- src/ai/services/modelTimeout.ts
- src/commands/commandTypes.ts
- src/commands/commandQueue.ts
- src/commands/commandMutations.ts
- src/commands/commandGuards.ts
- src/commands/commandAudit.ts
- src/ui/HeadAgentChat.tsx
- src/ui/CommandConfirmationModal.tsx
- src/ui/CommandResultCard.tsx
- src/ui/AISystemHealthPanel.tsx
- src/utils/sanitize.ts
- src/utils/safeJson.ts
- src/utils/rateLimit.ts

IMPLEMENTATION REQUIREMENTS:
- Use TypeScript.
- Use strict types.
- Use schema validation.
- Use safe fallbacks.
- Add tests or smoke checks for command parsing, validation, mutation guards, fallback behavior, and debug panel metrics.
- Keep existing UI styling consistent.
- Ensure keyboard accessibility.
- Ensure no API keys are exposed in frontend code for production deployment.
- If the current project is frontend-only, isolate AI calls behind a service boundary and clearly mark the production migration point for server-side execution.

ACCEPTANCE CRITERIA:
- Natural-language commands produce structured command proposals.
- Invalid commands are rejected safely.
- Ambiguous commands ask for clarification.
- Safe commands mutate workspace state.
- High-impact commands require confirmation.
- Every command attempt is logged.
- The debug panel shows active model alias, latency, failed calls, parse rate, broadcast queue length, audio queue length, mutation queue length, fallback count, timeout count, and last validation error.
- Existing Phase 1 broadcasts still work.
- TTS is not implemented yet.
```

---

# Output: Concrete Deliverables

The Phase 2 build should produce:

1. `AI_CAPABILITIES_ROADMAP.md`
2. Head Agent chat UI
3. Gemini Function Calling contract definitions
4. Command parser and router
5. Safe mutation queue
6. Mutation guard layer
7. Command confirmation modal
8. Command result cards
9. Command audit feed
10. AI System Health debug panel
11. Shared validation utilities
12. Smoke tests or manual verification checks

---

# Implementation Considerations

The correct build sequence is:

1. Normalize existing agent/workspace state types.
2. Add command schemas.
3. Add safe JSON parsing and sanitization utilities.
4. Add function calling contracts.
5. Add command router.
6. Add command mutation queue.
7. Add mutation guards.
8. Add Head Agent UI.
9. Add audit feed.
10. Add AI System Health panel.
11. Add tests.
12. Verify Phase 1 still works.

The main design decision is to make the AI router propose commands, while deterministic local code decides whether those commands are safe and executable. That prevents the model from becoming a hidden authority over app state.

---

# Performance / Security Notes

The biggest performance risk is uncontrolled model-call frequency. Phase 1 broadcasts, Phase 2 command routing, Phase 3 diagnostics, and Phase 4 TTS can easily create overlapping calls. Use a queue, request deduplication, abort timeouts, cooldowns, and per-session model budgets.

The biggest security risk is trusting model output. Every model response must pass schema validation, sanitization, permission checks, and mutation guards. Function calling should never directly mutate state.

The biggest UX risk is alert fatigue. That is why TTS is gated until diagnostics and severity logic are stable.

---

# Recommended Next Steps

1. Add this file to the project root as `AI_CAPABILITIES_ROADMAP.md`.
2. Start Phase 2 by creating command types and schemas.
3. Add safe JSON parsing and output sanitization before wiring Gemini Function Calling.
4. Build the mutation queue before creating UI command buttons.
5. Add the AI System Health panel early so debugging is available during implementation.
6. Do not begin TTS work until command routing and diagnostics are both stable.

---

# CLAIMS CHECK

- This roadmap intentionally uses model aliases instead of fixed model IDs because Gemini preview model availability can change.
- This document does not claim that a specific preview model ID is stable.
- This document assumes Phase 1 already exists based on the provided roadmap.
- This document does not claim direct modification of the live AI Studio project; it is a project documentation file and implementation plan ready to add to the project.
- Counterexample: If the current app has no centralized agent state store, Phase 2 must begin by creating or normalizing that store before command mutation can be implemented safely.
- Contradiction avoided: TTS is listed as Phase 4 but explicitly blocked until command routing and diagnostics are stable.
