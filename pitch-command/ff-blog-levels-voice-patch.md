# ff-blog-interactive.html — Voice Patch (Levels object)

**Scope:** Drop-in replacements for `LEVELS[2]` and `LEVELS[3]`. These are the two levels
I had in full. Applied the v2 voice brief in **DIRECTIVE** register — the funnel job is
preserved (one CTA per level kept), the four drift violations are removed:

- supporting concept-nouns de-capitalized (persona labels kept — they're load-bearing)
- unanchored hype swapped for concrete payoff or contrast
- filler closers cut
- one emphasis per blocker, nothing else bolded

**Not patched here (need the real file):** Level 1, the back half of Level 4, any Level 5,
and the component/CSS. Only 4 project files were mounted this session and this wasn't one —
upload `ff-blog-interactive.html` and I'll do a full surgical pass.

---

## Drop-in: replace LEVELS[2]

```js
  2: {
    color: '#BA6EF7',
    badge: 'Level 2 — The Builder',
    headline: 'You\'ve integrated AI. The output just isn\'t quite yours yet.',
    subhead: 'You\'re getting value but hitting a quality ceiling — the AI doesn\'t know enough about your business to stop guessing. The fix is a single context dump. An afternoon, not a project.',
    blockers: [
      { icon: '🧠', text: '<strong>Incomplete context.</strong> Your workspace has some info but not the full picture — no writing samples, thin client profiles, methodology that still lives only in your head.' },
      { icon: '🔁', text: '<strong>No feedback loop.</strong> You edit the outputs but never feed the corrections back in. Every edit is a lesson the AI never learns.' }
    ],
    actions: [
      { title: 'Do the full brain-dump interview.', desc: 'Open Claude and say: "I\'m building a business brain. Ask me questions to pull out my methodology, tone, and ideal client." Forty-five minutes of input the AI reuses on every task after.' },
      { title: 'Load 3 writing samples you\'re proud of.', desc: 'Three pieces that nail your voice, pasted into your Project with one note: "This is what my finished work sounds like." The output stops guessing at your tone.' },
      { title: 'Build a "what done looks like" doc.', desc: 'For your top 3 deliverables, write one paragraph describing a perfect output. Load it into your Project. That gives the AI an acceptance criterion, not just a task.' }
    ],
    cta: 'Get your AI Setup Audit',
    ctaSub: 'Find the specific gaps in your context setup and close them fast.'
  },
```

## Drop-in: replace LEVELS[3]

```js
  3: {
    color: '#E080D8',
    badge: 'Level 3 — The Automator',
    headline: 'Your context is solid. Now the work needs to start without you.',
    subhead: 'You\'ve solved the quality problem. The next bottleneck is volume — you\'re still initiating everything by hand. One mapped automation moves more this month than any prompt you could write.',
    blockers: [
      { icon: '🔧', text: '<strong>No trigger-based workflows.</strong> You start the tasks. The system should be starting them for you. The gap is mapping the trigger → completion chain, not building the automation.' },
      { icon: '📋', text: '<strong>No approval process defined.</strong> Before you automate anything client-facing, you need a written human-in-the-loop rule. Without it, speed creates liability.' }
    ],
    actions: [
      { title: 'Map your most painful repeating task end-to-end.', desc: 'Record yourself doing it on Loom while narrating. Transcribe it. You\'ll find 3–5 steps that can run on their own — more useful than any automation tutorial.' },
      { title: 'Define your human-in-the-loop rule now.', desc: 'Before you build anything, decide what needs your eyes before it ships. "Anything client-facing gets my review" is a sufficient rule. Write it down. That\'s what lets you trust the automation.' },
      { title: 'Build one workflow this week, not five.', desc: 'Pick the single highest-ROI automation from your map. Build it in Relay.app, Make, or Zapier. Run it for two weeks before you touch anything else.' }
    ],
    cta: 'Book a workflow mapping session',
    ctaSub: 'Map your first automation from trigger to completion in one hour.'
  },
```

---

### Change log

**Level 2**
- subhead: removed "The Business Brain Dump is the unlock — and it's closer than you think" → concrete + contrast ("An afternoon, not a project").
- action 1: "the most leveraged hour you'll spend this month" → "input the AI reuses on every task after" (concrete payoff). Lowercased "brain-dump."
- action 2: "Watch the output quality jump" → "The output stops guessing at your tone" (define-by-contrast).
- minor hedge trims.

**Level 3**
- subhead: "will do more for your business this month than any prompt improvement" → tightened to "moves more this month than any prompt you could write" (same claim, less filler).
- action edits: trimmed hedges, kept the concrete anchors (3–5 steps, two weeks, named tools) — these were already on-voice.
- CTA + ctaSub kept; already concrete.
