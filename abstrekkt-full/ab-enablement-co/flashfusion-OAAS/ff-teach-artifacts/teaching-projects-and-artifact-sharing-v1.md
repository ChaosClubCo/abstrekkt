# Teaching Claude Projects & Artifact Sharing — Master Reference

> Train-the-trainer reference. Verified against support.claude.com (Mar 2026).
> Single edition by design: this is a methodology doc for the facilitator
> (you), not a 3-tier audience deliverable. The audience-adaptation logic
> lives *inside* it because the subject is multi-audience teaching.
> [Assumption stated per standing 3-edition rule — flag if you want it split.]

---

## TL;DR

Teaching Projects = teaching context management ("Claude has amnesia;
Projects cure it"). Teaching artifact sharing = teaching its **boundaries
first**, because the failure modes (silent storage loss, account-tier
publish lock, irreversible unpublish) burn trust faster than the feature
builds it. Most public "share with anyone, no account" guidance is wrong
for your INT context — correct facts below.

---

# PART 1 — TEACHING PROJECTS

## The Mental Model (lead with this, every audience)

> Without a Project, Claude is a first-day contractor who forgets
> everything between meetings. With a Project, Claude is a team member
> who read the handbook before showing up.

Every feature maps to this: instructions = the handbook, pinned files =
desk reference, project memory = their working notebook.

## What a Project Is, Mechanically

Three independent systems under one memory-isolated namespace:

| Layer | Function | Teaching analogy |
|---|---|---|
| Custom instructions | Persistent system prompt on every chat in the project | Standing orders |
| Pinned knowledge files | Documents in context every conversation | Reference shelf |
| Project memory | Auto-generated, project-scoped memories | Personal notebook |

Hammer the isolation: the "Client Work" project knows nothing the
"Personal" project discussed. Feature, not bug — but name it explicitly
or learners stay confused.

Plan gate: Projects require **Pro or above**. Individual Pro users
**cannot share a Project**; Project sharing is Team/Enterprise. State this
early — it's a common misconception and a legitimate upgrade trigger.
[SOURCED — claude-profile-setup-reference.md, support.claude.com]

## Setup Sequence (teach in this exact order, with UI paths)

1. **Create + name for a real context.** Left sidebar → **+ New Project**.
   Name it `Client: Acme`, `Role: Ops Lead`, `Initiative: Q3 Launch` —
   never "My Project." The name is a forcing function for scope clarity.

2. **Write instructions BEFORE opening a conversation.** Project → gear
   icon → Project instructions. This is where most people fail — they
   build instructions reactively mid-chat. Front-load it.

3. **Pin files strategically.** Project → paperclip → Upload.
   Pin only what's needed *every* conversation (style guide, schema,
   glossary). Paste situational docs per conversation instead. Every
   pinned file consumes context on every turn — pinning a 200-page manual
   to use 3 pages degrades performance. Extract the 3 pages, pin those.
   [GENERATED — architecturally accurate; exact token cost unverified.]

4. **Test before trusting** (see protocol below).

## The Instruction Template (end-user-safe — no abstract headers)

The prior version used headers like "DOMAIN RULES" that mean nothing to
non-technical users. Replace with plain-language prompts they fill in:

```
You are helping me with: [what this project is for, one sentence]

About me: I am [name], a [role] at [org]. When you help me, assume I
know [their domain] but not [what they don't know].

How I want answers:
- Length: [short / detailed / depends — say which]
- Format: [bullets / prose / tables / whatever]
- Tone: [plain and direct / formal / casual]

Always: [the one or two things you want every single time]

Never: [the one or two things that annoy you most]
```

Developers swap this for explicit system-prompt structure (role,
constraints, output schema, prohibitions). Same content, different
register — detect the audience, don't dumb down for devs or jargon at
end users.

## Instruction-Test Protocol (the step everyone underprescribes)

"Open a chat and see if it works" is too loose. Prescribed harness:

1. **Open a fresh conversation in the project.**
2. **Trigger test:** ask something that *should* invoke an instruction
   without mentioning the instruction. (Instruction says "always use
   bullet points" → ask an open question, check the format.)
3. **Prohibition test:** ask for the exact thing the "Never" line forbids.
   It should decline or redirect.
4. **Context test (if files pinned):** ask a question only answerable
   from a pinned file. It should answer from the file, not guess.

**Pass:** all four behave as written.
**Fail diagnosis:** format ignored → instruction too vague, make it
specific and measurable. Prohibition ignored → it's buried; move it to
the top AND bottom of the instruction block (attention is highest at
edges). File not used → file too large or irrelevant content drowns the
signal; trim it.

This converts the highest-drop-off step into something a non-technical
user can actually self-check.

## When to Use a Project vs. Just Chat

> **Project:** 3+ conversations on this topic, repeated context
> re-explanation, need consistent output format across sessions, or
> reference files you'd otherwise paste every time.
>
> **Just chat:** one-off, no recurring context, empty instruction set.

## Anti-Patterns (convert each into a before/after demo, don't just list)

- **Vague + long instructions.** "Be professional and concise" teaches
  nothing. Demo: show the bad set, show Claude's generic output, show
  the specific rewrite, re-test. Lands ~5x better than telling.
- **Project for a one-off.** Recurring contexts only.
- **Pinning everything.** Every file, every turn, every conversation.
- **Not testing.** Write → assume → wonder why it's ignored.
- **Trusting memory as storage.** Project memory is a background-generated
  synthesis with lag and selective extraction — not a database. Don't
  architect workflows that assume it captured everything immediately.

---

# PART 2 — TEACHING ARTIFACT SHARING

## The Honest Pitch

Build an interactive tool/app/doc → publish → shareable link. No Vercel,
no GitHub, no domain. Genuinely magical. Three recipient actions: **view**,
**Customize** (fork into their own Claude chat — formerly "Remix"),
**embed** (iframe with an allowed-domains allowlist).

## The Verified Facts (most online guidance is wrong — teach these)

| What people believe | Verified reality | Source |
|---|---|---|
| "Anyone with the link, no account, full use" | Free/Pro/Max published: basic interaction works **without signup**; AI features + Customize **require signup**. Some recipients hit a claude.ai auth screen | support.claude.com [SOURCED] |
| "Team/Enterprise publish works like Pro" | Team/Enterprise artifacts **cannot be public** — org-internal only, viewers must auth with org account, automatic, not a toggle | support.claude.com [SOURCED] |
| "Can't revoke a published link" | **Unpublish exists and revokes access** | support.claude.com [SOURCED] |
| "Unpublish is reversible" | **Cannot republish the same artifact**; you ship a new URL | support.claude.com [SOURCED] |
| "Unpublishing just hides it" | **Permanently deletes ALL storage data, personal + shared** | support.claude.com [SOURCED] |
| "Storage always works" | Storage works **only on published artifacts**; fails silently otherwise | support.claude.com [SOURCED] |
| "Admins can't control this" | Org admins can enable/disable artifact MCP access and manage some artifact settings org-wide | support.claude.com [SOURCED] |

## Real Pros (still true)

- Zero-setup distribution of working interactive tools — no technical
  overhead for the sharer.
- Customize is a real collaboration primitive: fork → modify → reshare
  (recipient needs a Claude account for this).
- Persistent storage enables stateful shared tools (trackers,
  leaderboards) across all users — *when published*.
- Team/Enterprise: build an internal tool in a meeting, share the
  org-gated link before it ends.

## Real Cons (teach these explicitly — this is where you earn trust)

1. **Publish is account-tier-bound.** Pro/Max → publicly viewable.
   Team/Enterprise → org-locked, no external sharing, no opt-out. You
   cannot choose; the account type decides.
2. **Unpublish is a one-way data-destroying action.** No republish of the
   same artifact, and all persistent storage (personal + shared) is
   permanently deleted. Never unpublish anything live.
3. **Storage only exists post-publish.** Unpublished/raw-code artifacts
   silently fail every storage operation. Most "it's not saving" bugs
   are this.
4. **Recipient ≠ conversation.** They see the rendered artifact only —
   no prompts, no project context, no version history. Clean output,
   but confusing when they try to understand or extend it.
5. **Customize requires a Claude account.** The "anyone can remix" pitch
   is dead for accountless external stakeholders.
6. **Version updates push live.** Editing + saving updates the published
   link immediately. Active users get the new version on next load,
   no warning, no version pinning.

## When to Share a Link vs. Create a File

| Scenario | Artifact link | File (.docx/.xlsx/Notion) |
|---|---|---|
| Interactive tool, internal team on same org | ✓ (org-locked, fine) | — |
| Interactive tool, external client | Only from Pro/Max acct; no auth gate | Often safer |
| Anything with sensitive data | — | ✓ access-controlled |
| Long-lived reference needing versioning | — | ✓ (Notion/Doc) |
| Deliverable entering someone's system | — | ✓ |
| Stateful shared tool (tracker, leaderboard) | ✓ if published + backup plan | — |

## Facilitation Sequence (with recovery scripts)

1. Build something they actually want during the session — don't explain
   abstractly.
2. Walk Publish. State the account-tier rule out loud as you do it.
3. Open the link in a clean context — show exactly what a recipient sees
   (and the auth gate if Team/Enterprise).
4. **Drop the boundary, let them name the risk:** "Notice anyone in our
   org with this link sees everything in the source conversation too.
   What would be a problem to share this way?"
5. **Recovery script — "I already shared something sensitive":**
   "Two things. One: if you're on our Team/Enterprise account it never
   left the org — lower risk than you think. Two: unpublish revokes
   access now, but it permanently deletes any saved data and you can't
   republish that one. So: unpublish it, confirm you've exported anything
   you need first, and rebuild clean. Let's do it now." — keeps the
   session from derailing and models the correct response.
6. Contrast with file creation for anything access-controlled.

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

- *Claim:* [SOURCED] Team/Enterprise artifacts cannot be published
  publicly — org-internal only.
  *Counterexample:* a user with both an INT org account and a personal
  Pro account can rebuild and publish externally from the personal
  account — the lock is per-account, not per-user, so "you can't share
  externally" is false at the person level.
- *Claim:* [SOURCED] Unpublishing permanently deletes all storage data.
  *Counterexample:* if a backup (Option A Notion sync) is wired, the
  durable copy survives — the deletion is total only for storage-only
  artifacts. The suite is currently storage-only, so the claim holds
  *today* but is fixable.
- *Claim:* [GENERATED] The four-part instruction-test protocol reliably
  predicts real-world instruction-following.
  *Counterexample:* an instruction set can pass all four canned tests and
  still fail on novel phrasings or under context saturation from large
  pinned files — passing the harness is necessary, not sufficient.
- ! *Contradiction:* The original teaching content (project files) tells
  learners "share the link, they can use it without a Claude account."
  Verified facts contradict this for AI-powered and Team/Enterprise
  artifacts. The project's own KB needs this correction propagated.

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- The ~20MB storage cap is third-party-sourced, not confirmed on
  support.claude.com — verify before teaching a number.
- Whether INT is Team vs. Enterprise changes which admin controls apply;
  not confirmed in project files. Confirm before any admin-audience
  session.
- SCIM-deprovision behavior for Projects and published artifacts owned by
  a removed user: still unverified anywhere.
- Whether the suite's artifacts actually call the Notion MCP connector on
  write (determines if n8n reads real data) — needs source inspection of
  `01`/`04`/`05`, not resolved here.
- Free/Pro/Max "view without signup vs. auth wall" has conflicting
  accounts (official says basic works without signup; a commercial
  third-party claims a hard wall). Treat official as authoritative; spot-
  check with a real logged-out browser before high-stakes client demos.
