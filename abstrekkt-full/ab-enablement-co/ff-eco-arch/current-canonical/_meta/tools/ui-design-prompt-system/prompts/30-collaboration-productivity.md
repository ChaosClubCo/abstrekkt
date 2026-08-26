# Collaboration & Productivity Surfaces

Real-time, multi-pane, long-session apps. The hard part is connection resilience
and presence — force offline/queue/conflict states or you get "demo-only realtime."

> Assumes Brand Header + Enforcement Block + Prompt 0 pasted above.

---

## P02 — Ultra-Wide Collaboration App (1440p-4K, real-time)
*Audit: states ✓ (canvas exempts "disabled"). Generate in Batch 1 — defines the app shell.*

**COMPACT:**
```
Design a responsive collaboration web app UI optimized for ultrawide monitors
(1920-3440px). Screens: Dashboard, Project Space, Live Presence/Chat, Activity
Log, Settings.
Requirements:
- Three-column layout on wide screens: left project nav, center canvas/doc,
  right inspector/presence.
- Persistent top command bar: global search, quick actions, notifications, profile.
- Real-time presence: avatars + cursors, "who's viewing" panel, typing indicators.
- Include: empty states, offline banner, reconnecting state, permission-gated UI
  (viewer/editor/admin).
Output: layout rules for 1440/1280/1024; ensure no cramped UI at 1024.
```

**MAX-DEPTH SYSTEM ROLE:** Principal UX designer + frontend architect for real-time
collaboration products (Figma/Notion/Linear-grade). **Core use cases:** create/edit
shared docs/boards; presence (avatars, cursors, live typing); comments/mentions/tasks;
version history + conflict handling; workspace search. **Ultra-wide behavior:** >1800px
show right panel + Insights rail; 1366-1440px collapse insights rail, right panel toggles;
tablet → nav drawer + right panel as bottom sheet. **Widgets (real, not decorative):**
LivePresenceCluster, RealtimeStatusPill (connected/reconnecting/offline), ActivityTimeline,
CommentThread (inline anchors), TasksSidebar, VersionHistoryDrawer (diff preview),
PermissionsPanel (role + share links + expiration). **Interaction:** remote cursor +
selection-color mapping; connection resilience (offline banner, queued-changes indicator,
conflict-resolution modal: last-write-wins vs merge); keyboard-first (Cmd/Ctrl+K palette,
`/` to insert blocks, shortcuts overlay); polite aria-live for presence updates.
**Data contract:** 3 projects, 12 docs/boards, 6 members with roles, 20 activity events,
8 comments, 5 tasks, 5 versions. **Output:** routes + breakpoints + component architecture;
state machine for realtime connection + editing; mock JSON + event schemas; Figma frame
description + tokens; React/Angular component plan.

---

## P13 — AI Chat + Tool Panel Interface
*Audit: full state coverage ✓.*

```
Design an AI chat UI with an integrated tool/action panel. Layout: chat timeline
(streaming responses), right tool panel (files, functions, history), bottom prompt
composer with suggestions.
States: streaming, tool-execution, tool-failure, retry/error recovery.
Requirements: prompt history + pinning; export conversation.
Output: desktop + mobile (collapsed tool-panel behavior).
```

---

## P21 — Email Inbox + Triage (power user)
*Audit [FIX-3.5]: added offline + sync-error states.*

```
Design a high-density email inbox with triage workflow. Features: split pane,
smart categories, bulk actions, snooze, quick replies.
States: default, loading, empty, offline, sync error, spam warning, success.
Include: keyboard-shortcuts panel.
Output: 1440 dense layout; collapse to single column at 768.
```

---

## P22 — Customer Support Ticket Desk
*Audit: full state coverage ✓.*

```
Design a ticketing UI. Screens: ticket queue, ticket detail, customer profile
sidebar, macros, SLA timers.
Include: assignment, escalation, internal notes, public replies, attachments.
States: rate-limited API, partial load, loading, empty, error, success.
Output: dense layout; permission-gated internal notes.
```

---

## P24 — Calendar + Scheduling (meeting-heavy)
*Audit: full state coverage ✓.*

```
Design a scheduling UI. Features: week view, availability heatmap, meeting
templates, time-zone handling, booking-page preview.
Include: conflict detection + reschedule flow.
States: loading, empty, error, success, disabled.
Output: desktop + responsive; time zones shown explicitly.
```

---

## P10 — Getting Started / Onboarding Wizard
*Audit: full state coverage ✓.*

**COMPACT:**
```
Design a "Getting Started" wizard. Steps: Welcome + value prop, Connect
account/integration, Choose preferences (theme, notifications), Import data
(optional), Tutorial tour + completion.
Requirements:
- Progress indicator, back/next, skip, save+exit.
- Validation per step + error recovery.
- Subtle completion celebration.
Also design a compact post-onboarding checklist screen.
```

**MAX-DEPTH:** SYSTEM ROLE — senior onboarding designer optimizing activation, not
vanity tours. FLOW: Welcome → choose goal/persona → connect integrations (optional but
encouraged) → configure defaults → create first project/sample → success + next-best-actions;
"Skip" paths still land the user somewhere useful. REQUIREMENTS: stepper with progress +
estimated time, inline validation, save-and-resume, short actionable microcopy. OUTPUT:
step-by-step frames + component list, event-tracking plan (activation metrics),
error/empty/loading states, keyboard-only interaction spec.
