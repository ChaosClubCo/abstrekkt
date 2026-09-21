# Signature Theme Prompts (the differentiators)

These six themes are what the source cared about most — they encode *why* people
behave, not just *what* they do. Each brief below is grounded in the source's
verbatim intent.

## 1. Emotional Layer
> Address two trust/motivation/burnout loops: (1) *my* development; (2) the
> *user's*. Tools: celebratory popups, progress trackers, nudges.
```
For {{app}}, map the emotional journey for BOTH the builder (me) and the user.
For each, find the moments of friction, doubt, and burnout. Propose specific
interventions (celebratory popup, progress tracker, gentle nudge) at each low
point — and say when an intervention would be patronizing instead of helpful.
```
*Why:* sustained use is emotional, not just functional; burnout kills both sides.

## 2. Behavior Analytics vs Usage Metrics
> Not what they did — *why*. Build a behavioral friction map: where users
> hesitate, back out, slow down, linger, quit, or abandon. Auto-offer help after
> a short delay. "Most bugs don't live in code — they live in confusion."
```
From {{funnel/session data}}, build a behavioral friction map: for each drop-off,
distinguish "couldn't" from "wouldn't" and hypothesize the confusion behind it.
Recommend where to auto-offer help after a {{N}}-second hesitation.
```
*Why:* usage metrics describe; behavioral analysis explains and is actionable.

## 3. AI as a Mentor, Not a Mirror
> Using Gemini/GPT/Replit/Expo/Firebase Studio as assistants → make them mentors,
> coaches, copilots. Teach, encourage, evolve with the user; suggest shortcuts,
> explain errors, even "throw shade" when appropriate. Name it.
```
Rewrite {{assistant}}'s system prompt so it acts as a mentor, not a mirror: it
teaches the "why", suggests the shortcut I didn't know, explains my errors plainly,
and (tastefully) calls out when I'm doing it the hard way. Bias to viability and
workarounds. Give it a name and a consistent voice.
```
*Why:* "the app that learns from users makes users want to learn from the app."

## 4. Unexpected Ecosystem Friction
> Ecosystems fight back. Audit mobile dependencies: OS updates, barcode-scanner
> compatibility, offline auth tokens, battery usage, hardware quirks. Generate
> fallback flows + workarounds the user notices.
```
Audit {{app}}'s dependence on the device ecosystem: OS updates, scanner/camera
compatibility, offline auth-token expiry, battery drain, hardware quirks. For each,
give a fallback flow the user actually notices and a graceful-degradation path.
```
*Why:* "the wild west of mobile devices breaks the best-built flows" unless expected.

## 5. Power of Network Effects
> Built for individuals — but networks of users benefit from others joining.
> Create a collaboration incentive system: badges, feature unlocks, rewards, or
> reduced sync throttling for invites + consistent/group task completion.
```
Design a collaboration-incentive system for {{app}} so users want to invite others:
badges, feature unlocks, rewards, or reduced sync throttling tied to invites and
group-task completion. Make the incentive honest (real value, not dark patterns).
```
*Why:* "apps with network effects scale themselves; otherwise you drag users one by one."

## 6. Digital Ethics & Invisible Load
> "I'm responsible for what the app does AND what it enables." Give operators
> override of AI decisions. Address mental fatigue: am I showing *just enough*
> data or overwhelming with dashboards? Build a quiet/focus mode. Add an ethics
> overlay per role — and one for me, the architect.
```
Create a digital-ethics overlay for {{app}}, one per role and one for me (the
architect). For each: where does the AI make a call a human should be able to
override? Where is the invisible cognitive load? Recommend a quiet/focus mode and
the data to hide by default.
```
*Why:* autonomy and cognitive load are design responsibilities, not accidents.
