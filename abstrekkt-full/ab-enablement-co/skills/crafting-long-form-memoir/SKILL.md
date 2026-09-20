---
name: crafting-long-form-memoir
version: "1.1.0"
description: >
  Scaffolds memoir writing and long-form craft practice for Kyle Rosebrook's
  Construction over Recovery project. Provides session openers, thesis
  integrity checks, scene construction guidance, structural architecture
  thinking, voice checks, and continuity protocols for returning after gaps.
  Activates when working on the memoir, stuck on a section of the book,
  questioning whether a scene fits the thesis, figuring out where the book
  starts or ends, turning a memory into a scene, checking if the voice
  sounds right, coming back to the memoir after time away, writing about
  difficult material, or asking any craft question about long-form personal
  narrative. Also triggers on: memoir, Construction over Recovery, book
  chapter, long-form writing, craft question, scene writing, memoir
  structure, what order to tell this, where does the book start, does this
  section work, this doesn't sound like me, I've been away from the book.
---

# Long-Form Memoir Craft

Scaffolding for the Construction over Recovery memoir. Not a ghostwriter.
Not a therapist. A set of tools that lowers the friction of the 30
micro-decisions-per-session that drain writing energy before a sentence
exists.

The `using-fart-prompt` skill handles the blank-page activation problem.
This skill handles what comes after: the session that has energy but no
direction, the section that doesn't know where it belongs, the voice
that sounds like "author performing depth" instead of Kyle.

---

## Evals

**Should trigger:**
1. "I haven't touched the memoir in about three weeks and I want to get back into it"
2. "I'm stuck on the scene where my dad picks me up — I can't get it to land"
3. "Can you check whether this section actually fits the Construction over Recovery thesis?"

**Should NOT trigger:**
1. "Write me a short story about a lighthouse keeper" — invented fiction, not memoir craft; this skill is only for the Construction over Recovery memoir
2. "Help me edit my colleague's essay" — someone else's writing, outside this skill's scope (use a general editing/writing skill)

---

## Decision Tree

```
What kind of session is this?

  ├─ I have energy but no direction / don't know what to write
  │    → Section 2: Session Opener

  ├─ I have a specific moment or memory to write about
  │    → references/scene-and-craft.md: Scene Construction

  ├─ I wrote something and I'm not sure it belongs / fits the thesis
  │    → Section 3: Thesis Integrity Check

  ├─ The architecture feels unclear (where does this go, what order)
  │    → references/architecture-and-thesis.md: Structural Thinking

  ├─ The voice feels off / sounds like "author performing"
  │    → Section 4: Voice Check

  ├─ Coming back after a gap (days, weeks)
  │    → Section 5: Continuity Protocol

  └─ Writing about material that is hard to be near
       → references/continuity-and-care.md: Difficult Material
```

---

## Section 1: The Book in One Line

Before any other session work, confirm the current thesis sentence:

**"This book argues that _______."**

The current answer: *Construction over Recovery — that building external
systems and forward momentum is not a substitute for healing, but
sometimes it is the healing itself, and the distinction matters less
than the building does.*

If this sentence has shifted since last session: good. Update it here
before writing anything. A thesis that never shifts is not being tested.
If it has not shifted in three months: ask whether you are writing or
performing the same idea repeatedly.

---

## Section 2: Session Opener

For when you're sitting down and don't know what to write.

**The question:** "What moment am I writing toward today?"

Not "what should I write" — too open, leads to structural analysis
instead of writing. Not "what is the next chapter" — too architectural.
"What moment" forces a scene, not a thesis statement.

**If you can name a moment:** start there. Do not ask whether it
belongs yet. Belonging is a revision question.

**If you cannot name a moment:** try these prompts in order until
one catches:

1. *What is the most specific thing you remember from the period
   you're writing about — not emotionally, sensory. A smell, a
   sound, a specific object in a specific place.*

2. *What is something you did during that period that you have
   never told anyone, not because it was shameful but because
   it seemed too small to mention?*

3. *What were you building during the period you're writing
   about, and what were you building it instead of?*

Prompt 3 is the thesis prompt. Use it when you want the writing
to stay close to the spine of the book.

**If nothing catches after all three:** that is information. Call
`using-fart-prompt` and lower the standard. An ugly paragraph
exists. A perfect paragraph in your head does not.

---

## Section 3: Thesis Integrity Check

Run this when a section feels either too on-the-nose or like it
doesn't connect to the book's argument.

**The core question:**
Is the thesis *demonstrated* or *asserted* in this section?

*Demonstrated:* The reader watches Kyle building. They infer the thesis.
*Asserted:* Kyle explains the thesis. The reader is told.

**The removal test:**
Delete every sentence in the section that directly states a version of
"Construction over Recovery." Read what remains.

- If the thesis is still present through the narrative: PASS —
  the section demonstrates.
- If the thesis disappeared with those sentences: FAIL —
  the section was asserting. Revise toward demonstration.

**The stress test:**
Where is the thesis *tested* in this section? A section where building
works cleanly is pleasant but thin. A section where building didn't
work, where recovery was genuinely needed and construction was the
wrong answer — that section earns the thesis.

Every significant section should include at least one moment where the
thesis faces pressure. Not disproven. Pressured.

Full thesis and structural guidance in `references/architecture-and-thesis.md`.

---

## Section 4: Voice Check

**Kyle's memoir voice, briefly:**
Direct sentences. Specific nouns (not "a difficult period" — name what
it was; not "my manager" — Daniel Bell). Anti-credential in register.
Uncertainty allowed without performance. The narrator looking back on
the past with perspective, not distance.

Full voice guide in `references/scene-and-craft.md`.

**Quick red flag scan — read the section and flag any of these:**

```
□ Sentence starts with "One must..." or "It is important to..."
□ Passive voice where active would do
□ Three or more adjectives on the same noun
□ A sentence that explains what a moment means
  (rather than showing it and letting it mean)
□ The word "transformative," "journey," or "process"
□ A sentence that could have been cut without losing anything
  except the feeling that something was said
```

**The deepest voice problem:**
When directness becomes a posture that prevents the sentences that
need to be slower. Your voice is right. The risk is that the voice
becomes armor. The memoir needs the moments where the armor is off.

A sentence that reads: *"I don't know if what I built that year was
construction or avoidance. I still don't."*

That sentence is in your voice. It is also honest in a way a clean
declarative claim cannot be. Let those sentences exist.

---

## Section 5: Continuity Protocol

For sessions after any gap of more than a few days.

**Before writing the first new sentence:**

1. Read the last three pages you wrote — all the way through,
   without editing
2. Write one sentence: *"The book is currently arguing that..."*
3. Write one sentence: *"The last scene I wrote was..."*
4. Ask the session opener question: *"What moment am I writing toward today?"*

This takes 10–15 minutes. It is not optional if you want the session
to feel continuous with the book rather than like starting over.

**If the continuity read reveals a voice break** — sections that
feel like different writers — do not fix it now. Mark it with a
note: `[VOICE CHECK — this section reads differently]`. Keep writing
forward. Voice edits happen in revision, not in production.

Full guidance in `references/continuity-and-care.md`.

---

## Self-Verification

Before ending any session:
- [ ] At least one sentence of actual prose written (not notes, not outline)
- [ ] The thesis sentence in Section 1 reflects what was written
- [ ] Any sections marked `[VOICE CHECK]` or `[THESIS CHECK]` are noted
  for revision — not fixed in-session unless revision was the plan

---

## CLAIMS
- The thesis integrity removal test consistently distinguishes
  demonstrated thesis from asserted thesis — it is the fastest
  diagnostic for a section that feels "too much about its point"
- "What moment am I writing toward today?" produces more first
  sentences than any structure-first approach, because it commits
  to scene before committing to placement
- Continuity protocols after gaps produce longer sessions than
  diving in without re-reading, because they reconnect voice
  before generating new material

## COUNTEREXAMPLE
- The removal test fails for sections that are *explicitly* essay-mode —
  some long-form memoir chapters are essayistic rather than narrative;
  in those sections, assertion is the mode and the test does not apply
- The session opener question fails when the block is not directional
  but motivational — that is the `using-fart-prompt` territory,
  not this skill's

## CONTRADICTIONS
- "Write toward a moment, not a structure" conflicts with the architecture
  work in the references — both are true at different phases; scene-first
  in production, structure-first in revision
- "Let uncertainty exist in the voice" conflicts with Kyle's natural
  directness — the skill asks for precision about uncertainty, which
  is different from vagueness; "I don't know" said clearly is not the
  same as "perhaps in some ways"
