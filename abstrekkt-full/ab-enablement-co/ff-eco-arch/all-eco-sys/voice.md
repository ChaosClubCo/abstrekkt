# Abstrekkt — Brand Voice System
## UX Language Operating System v1.0.0

---

## Register

Operational thinking-in-public. Written for adults reading at midnight.
The room is dark. The text is warm. The brass marks what matters.

**Not:** journalistic, breathless, tutorial-instructor, startup-cheerful.
**Yes:** architect explaining decisions. Direct, earned authority, zero hype.

---

## Grammar Rules

| Rule | Correct | Wrong |
|------|---------|-------|
| Declarative openers | "Draft saved." | "Your draft has been saved!" |
| Short sentences first | "Published. The piece is live." | "Congratulations! Your piece has been successfully published to..." |
| No "let's" | "Start here." | "Let's get started!" |
| No "and that's when I realized" | Remove entirely | Keep |
| Present tense for system states | "Saving..." | "We're saving your work..." |
| No passive construction | "Deleted." | "The entry has been deleted." |
| Brass kickers = labels, not copy | `◆ ESSAY` | `◆ Start reading essays!` |
| Error messages name the problem | "Email not recognized." | "Oops! Something went wrong." |
| No apology language in errors | "Email not recognized." | "Sorry, we couldn't find that email." |

---

## State-by-State Copy

### Success States

```
Save:         Draft saved.
Publish:      Published.
Delete:       Deleted.
Subscribe:    Subscribed. Welcome.
Submit:       Submitted.
Invite sent:  Invitation sent.
Copy:         Copied.
Upload:       Uploaded.
```

Rule: one or two words. Statement. Past tense of action completed.
Never: exclamation marks. Never: "Great!" Never: "Successfully."

---

### Error States

Error copy lives in `--color-text-error` (`#d47272`). Always AA-compliant.

```
Field required:      Required.
Email invalid:       Not a valid email address.
Email not found:     Email not recognized.
Password too short:  At least 8 characters.
Network failure:     Connection failed. Try again.
File too large:      File exceeds 10MB limit.
Permission denied:   You don't have access to this.
Conflict:            This already exists.
Server error:        Something went wrong on our end.
Session expired:     Session expired. Sign in again.
```

Rule: Name the problem. Name the fix if there is one. No apology. No "Oops."
Error messages are information. Treat them as such.

---

### Loading States

```
Page loading:        Loading...
Saving:              Saving...
Publishing:          Publishing...
Generating:          Working...
Uploading:           Uploading...
Searching:           Searching...
Analyzing:           Analyzing...
```

Rule: gerund + ellipsis. Nothing else. No percentage unless it's accurate.
Never: "Please wait while we..." Never: "Hang tight!"

---

### Empty States

```
No notes:
  ◆ NOTHING HERE YET
  Start with a thought worth keeping.
  [New note →]

No results:
  ◆ NO MATCH
  Try a different search.

No entries in table:
  No records found.

No activity:
  ◆ QUIET
  Nothing to report.

Draft empty:
  ◆ BLANK PAGE
  The page is blank. That's the only honest starting point.
```

Rule: Kicker in mono uppercase brass. One declarative line. Optional single CTA.
No emoji. No illustration description in copy. No "It looks like..."

---

### Onboarding Microcopy

```
First prompt / step 1:
  Start with what you know.
  You can change anything later.

Step progress:
  Step 2 of 4.  (label — not in heading)

Optional field hint:
  Optional.  (mono caption, right-aligned in label)

Required field indicator:
  * (brass, no "required" word)

First-run welcome:
  ◆ WELCOME
  The room is set up. Everything is where you put it.
```

---

### CTA Hierarchy

CTAs use JetBrains Mono, uppercase, 10–11px, letter-spacing 0.24em.
Brass for primary. Ghost-border for secondary. Never full-width.

```
Primary actions (brass border, brass text → brass fill on hover):
  PUBLISH
  SAVE DRAFT
  CREATE NOTE
  START HERE

Secondary actions (ghost border):
  CANCEL
  DISMISS
  BACK

Destructive actions (oxblood border, oxblood-text):
  DELETE
  REMOVE
  REVOKE ACCESS

Link CTAs (inline, brass color):
  Read more →
  View archive →
  Continue reading →
```

Rule: One primary CTA per screen maximum.
Never: "Click here." Never: "Learn more" without a subject ("Learn more about what?").
Link CTAs use the arrow `→` — never ">" or ">>" or "»".

---

## Kicker Convention

Kickers are categorical labels, not marketing copy. They orient the reader.
They are never sentences. Never questions.

```
Correct:  ◆ ESSAY
          ◆ DRAFT
          ◆ FEATURE
          ◆ ANNOUNCEMENT
          ◆ ARCHIVE
          ◆ STATUS

Wrong:    ◆ READ THIS ESSAY
          ◆ WHAT'S NEW?
          ◆ DON'T MISS THIS
```

---

## What This Voice Is Not

- Not conversational ("Hey, looks like...")
- Not enterprise-formal ("Please be advised that...")
- Not tutorial-voice ("First, you'll want to...")
- Not emotional manipulation ("You're so close!")
- Not performative warmth ("We're so glad you're here!")

The voice assumes the reader is an adult.
It gives them information and gets out of the way.

---

## Relationship to FlashFusion Voice

FlashFusion is B2B-electric: confident, outcome-focused, slightly urgent.
Abstrekkt is editorial-warm: declarative, patient, zero hype.

Never cross-contaminate voice tokens.
If you are unsure which register to use: Abstrekkt is slower, more considered.
FlashFusion is sharper, more direct-to-ROI.

---

*Voice system derived from: ABSTREKKT_DESIGN.md v1.0.0, kyle-origin-video-scripts-v3.md*
*Updated: 2026-06-11*
