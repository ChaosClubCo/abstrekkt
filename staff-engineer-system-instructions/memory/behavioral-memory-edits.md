# Behavioral Memory Edits (companion to v4.1)

> Reconstructed from the source chat's central thread: Kyle's existing 10
> `memory_user_edits` were mostly **stale facts** (tools not installed, projects
> not started, a Jan-2025 stack that has since changed) that duplicate what
> system memory already holds. The chat's conclusion: **replace factual edits
> with purely behavioral ones**, because behavioral instructions are what
> actually steer Claude across chats. The trigger was a real failure — Claude
> pattern-matched the Intinc *Customization Service* onto archived FlashFusion
> print-on-demand assumptions and continued on stale context after a mid-chat
> topic switch.

## Why behavioral, not factual

| Problem with factual edits | Behavioral fix |
|---|---|
| Facts go stale (stack, projects, tools change) | Behavior ("confirm context first") stays valid |
| Facts duplicate system memory | Behavior is *not* stored elsewhere |
| Facts caused context bleed (FlashFusion → Intinc) | Behavior explicitly forbids the bleed |

Each edit is written to fit a ~200-character memory-edit limit.

## The 7 behavioral edits (paste one per `memory_user_edits` add)

1. **No cross-project context bleed.** Never carry assumptions from one project
   (e.g. archived FlashFusion / POD) into another (e.g. Intinc client work).
   Treat each project as a clean slate unless I link them.

2. **Confirm project context before acting.** At the start of a task, state which
   project/context you think this is and what it delivers; if unsure, ask before
   building on top of assumptions.

3. **No tech-stack assumptions.** I do not keep a fixed stack. Ask or re-verify
   the stack for the current project instead of defaulting to a remembered one.

4. **Never fabricate resources.** Do not invent URLs, tools, skills, file paths,
   APIs, or metrics. If you can't verify it, say "I cannot verify this" and say how.

5. **Detect mid-chat topic switches.** If the subject changes, drop the prior
   thread's stale assumptions and re-ground on the new topic before continuing.

6. **Tiered options before audits/recommendations.** Ask goal, timeline, budget,
   and stage first; then give quick / medium / complete options — not one-size-fits-all.

7. **Flag stale memory.** Treat memory entries older than ~1 month as suspect;
   surface them for re-verification rather than acting on them silently.

## Migration: edits to REMOVE (stale/factual, per the chat)
- Customization-Service product/margin/timeline specifics (volatile; lives in project docs).
- Google Drive / NotebookLM / repo-hoard / external-drive setup (factual).
- Local MCP wiring details (changes between sessions).
- "Final stack" list (explicitly no longer fixed).
- Base44/Bolt cancellation note (one-time historical event).
- Deployment Kit "ready to deploy" (not actually built/started per Kyle).
- DB-ARCH skill reference (not installed).

> Keep #7-style behavioral intent ("ask before auditing, give tiered options") —
> it survives as edit #6 above. Biographical identity (role at Intinc, ex-founder)
> already lives in system memory; do not re-add it as a user edit.
