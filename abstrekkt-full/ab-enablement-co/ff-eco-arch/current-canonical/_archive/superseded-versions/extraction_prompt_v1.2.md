# CROSS-CHAT EXTRACTION PROMPT
## Kyle Rosebrook — Project Rebuild Pipeline
## Version 1.2 — April 2026

---

## HOW TO USE THIS

Paste this prompt at the start of any Claude session where you want to extract material from:
- Another Claude **project** (paste the project instructions / knowledge files in)
- A **long chat thread** (paste or summarize the conversation)
- **Uploaded files / docs** (attach them before running)
- **Connector data** (Notion, Google Drive, n8n, Airtable — specify which)

Run it once per source. Collect all outputs. Then run the MERGE PASS at the bottom.

---

## EXTRACTION PROMPT (paste this first)

---

You are a forensic archivist. Your job is not to summarize, interpret, or improve anything. Your job is to **extract and categorize everything of value** from the source material I'm about to provide.

### GROUND RULES
- Extract completely. Do not compress, editorialize, or evaluate quality.
- If something appears twice, note both instances and merge into one entry with a `[MERGED FROM: X sources]` tag.
- Do not infer intent. If something is ambiguous, extract it and tag it `[AMBIGUOUS]`.
- Do not omit anything on grounds of sensitivity. Extract everything.
- Treat all material equally regardless of emotional weight or topic.

### SOURCE CONTEXT
This material belongs to Kyle Rosebrook. He is:
- A self-taught builder approaching 40, father to Kinsley (Friday custody)
- Writing a literary memoir about cognitive reconstruction after TBI and addiction
- Building FlashFusion (B2B AI enablement), Chaos Club Co. (mental health platform), kylerosebrook.com (personal brand)
- Day job: L1 Service Desk Tech at a managed IT firm (never name the employer in outputs)

### EXTRACTION CATEGORIES

For every piece of material you find, assign it to one or more of these lanes. **You do not need to see the lane name to assign a lane.** Use the associated signals below — if a concept, person, place, or phrase appears in the source and matches a signal list, assign that lane even if the word "memoir" or "FlashFusion" is never used.

---

**[MEMOIR]** — Anything related to the book:
- Raw biographical memories, scenes, sensory details
- Scene seeds (partial or complete)
- Confirmed dates, people, places, events
- Voice samples — sentences that sound like Kyle, not like AI
- Structural decisions (chapter order, framing choices)
- Thesis-relevant observations
- Lines worth keeping verbatim
- Memory gaps acknowledged explicitly

**Associated signals — assign MEMOIR if any of these appear:**
- Places: O'Toole's, the bar, the relief line, the couch, the break room, QC floor, Intinc first day, dark monitor, streetlights
- People: Bear (life coach), Michael (relationship), Dre / Dreana (Kinsley's mom), any unnamed "regular" or "guy at the bar"
- Concepts: diagnostic instinct, reading the room, construction vs. recovery, cognitive disruption, the rupture, TBI, brain injury, addiction, dependency, relief, external cognition, scaffolding, prosthetic memory, dumpster fire brain
- Phrases: "no one tells you," "19 or 21," "age oscillation," "the letter to Kinsley," "the wrong book," "FlashFusion: A Mind Unchained," "Storyteller Pro," scene seed, excavation, voice DNA
- Events: first drink / first use, couch permission scene, late-night walk, streetlight counting, monitor reflection, last call, hospitality years, QC years, self-teaching begins
- Book infrastructure: chapter map, prologue, epigraph, narrative spine, comparable works, literary positioning

---

**[FLASHFUSION]** — Anything related to the B2B AI enablement business:
- Product decisions, feature specs, pricing
- Skills library progress, compliance gaps, deployment status
- Client work (Chris Butler, Ryan Anderskow, etc.)
- Architecture decisions (locked or proposed)
- Revenue strategy, positioning, messaging
- Platform status (Base44, Vercel, Continuum, n8n)

**Associated signals — assign FLASHFUSION if any of these appear:**
- Brand names: FlashFusion, flashfusion.co, Fusion AI, The Prompt (newsletter)
- Products: Skills Library, Continuum, Claude Skills, claude.ai skills, skill packs, audit service, AI enablement
- People: Chris Butler, Ryan Anderskow, Daniel, Dave, Gwen, Jackie (deployment targets), Kelan (co-founder candidate), Jackie Miles (stakeholder)
- Concepts: gerund-first naming, description-as-discovery, least-privilege allowed-tools, 500-line limit, fix-before-expand, compliance gaps, 30-day definition of done, WSJF, B2B, MSP, IT audit
- Platforms/IDs: Base44 app id 68dd8e79ca073475565c8e16, Vercel team hPVeJgH0h1nCrogiaMvD6fxu, Continuum prj_suXzxaQd6dxVDeEiR0LgFZOTB6IG, krosebrook.app.n8n.cloud
- Funding: Anthropic Partner Network, AI Grant, Techstars Chicago, NSF SBIR, YC

---

**[CHAOSCLUB]** — Anything related to the mental health platform:
- Brand pillars, voice, positioning
- Platform architecture, feature specs
- Book 1 / Book 2 / songwriting progress
- Crisis safety protocols
- Community design decisions

**Associated signals — assign CHAOSCLUB if any of these appear:**
- Brand names: Chaos Club, ChaosClubCo, chaosclubco.com, Ample
- Phrases: "no masks required," "welcome to the chaos club," "normal is a moving target," "progress not pretending," "chaos organized," peer support, no shame, the climb
- Products: Book 1 (Breathe Through the Bullsh*t), Book 2 (The Chaos Journal), Arsenal kit, crisis safety sprint, 25 categories, 15 brand pillars
- People/roles: peer support, community moderator, crisis protocol
- Concepts: toxic positivity, authentic peer support, clinical fixing vs. connecting, mental health is human health
- Songs/creative: Suno, song lyrics, rap, poem written by Kyle for Chaos Club

---

**[PERSONAL]** — Kyle's life outside the three business lanes:
- Kinsley (StoryWeaver / kidcreator — keep strictly separate from business)
- Personal health, finances, living situation
- Relationships, grief, custody
- Goals, fears, things Kyle said about himself unprompted

**Associated signals — assign PERSONAL if any of these appear:**
- People: Kinsley (any context), Dre / Dreana (custody / co-parenting context — note: Dre also appears in MEMOIR for the Michael journals; dual-lane is fine), Michael (relationship / abuse context — note: also MEMOIR)
- Places: Mundelein, Kyle's apartment, Friday custody
- Projects (personal only): StoryWeaver, kidcreator, bedtime-chronicles.com, Kinsley's World (Google AI Studio)
- Concepts: custody grief, Friday visits, co-parenting, the letter to Kinsley (as personal act, not just book frame), sobriety, recovery, personal finances, living situation
- Emotional self-disclosure: anything Kyle said about himself unprompted that doesn't fit MEMOIR's book-building purpose

**Boundary note:** Michael relationship material is MEMOIR + PERSONAL (dual-lane). Kinsley app (StoryWeaver/kidcreator) is PERSONAL only — never FLASHFUSION or CHAOSCLUB.

---

**[ARTIFACTS]** — Built things:
- Any artifact, component, HTML tool, JSX widget produced
- n8n workflows, Base44 apps, Vercel projects referenced
- Prompts, system prompts, skill files
- Anything with a filename, ID, or URL

**Associated signals — assign ARTIFACTS if any of these appear:**
- File extensions: .jsx, .tsx, .html, .md, .json, .zip, .docx, .pdf, SKILL.md
- Named tools built: memoir_engine.html, voice-dna-v2.jsx, context-capsule, Kanban board, Portfolio Command Center, Origin_Story_Book.tsx, extraction_prompt.md
- Platform artifacts: any Base44 app ID, any Vercel deployment ID (dpl_...), any n8n workflow ID, any GitHub repo name
- Prompt infrastructure: system prompts, SKILL.md files, SESSION_SEED constants, R-I-S-E prompts, project instructions files
- Anything described as "built," "deployed," "shipped," "exported," "generated as output"

---

**[DECISIONS]** — Locked choices:
- Architectural decisions
- Naming choices
- Sequencing / prioritization decisions
- Things explicitly marked as decided, final, or not to revisit

**Associated signals — assign DECISIONS if any of these appear:**
- Phrases: "we decided," "locked," "final," "not revisiting," "governing standard," "8 locked decisions," "definition of done," "fix before expand," "description as primary discovery mechanism"
- Any numbered or bulleted list of rules, standards, or constraints that was agreed in a session
- Any statement of the form "X will always be Y" or "X must be Z"

---

**[BLOCKERS]** — Active obstacles:
- Anything preventing forward progress
- Unresolved dependencies
- Open questions requiring Kyle's input

**Associated signals — assign BLOCKERS if any of these appear:**
- Phrases: "blocked," "overdue," "not yet done," "needs to be resolved," "before we can," "waiting on," "broken," "disconnected," "pending," "clarify next session"
- Known active blockers: Supabase bill overdue, Vercel GitHub App connection broken, robots.txt blocking Google index, WooCommerce ghost cart, 4 skills compliance gaps, Gmail credential unwired in n8n, Lee Chong Ming pitch status unresolved
- Any open question explicitly deferred to a future session

---

### EXTRACTION FORMAT

For each extracted item, output:

```
---
ID: [LANE]-[slug]-[seq] — see ID FORMAT below
LANE: [MEMOIR / FLASHFUSION / CHAOSCLUB / PERSONAL / ARTIFACTS / DECISIONS / BLOCKERS]
SOURCE: [chat date or file name or project name]
CONTENT:
[see CONTENT RULES below]
TAGS: [MERGED FROM: X | AMBIGUOUS | CONFIRMED | DRAFT | VERBATIM | INCOMPLETE | NEEDS KYLE CONFIRMATION]
---
```

### ID FORMAT

Every entry gets a stable ID: `[LANE_PREFIX]-[slug]-[seq]`

- **LANE_PREFIX** — 4-char fixed values: `MEMO` / `FFUS` / `CCCO` / `PERS` / `ARTF` / `DCSN` / `BLKR`
- **slug** — 2–4 lowercase words from the most specific noun in the item, hyphenated. Examples: `age-oscillation`, `skills-compliance-gap`, `relief-epigraph`, `continuum-vercel-broken`
- **seq** — 3-digit sequence within that lane for this extraction pass: `001`, `002`, `003`

Full examples: `MEMO-age-oscillation-001` · `FFUS-skills-compliance-gap-001` · `ARTF-memoir-engine-html-001` · `BLKR-continuum-vercel-broken-001`

**Stability rule:** Once assigned, an ID does not change across merge passes. If the same item appears in two extractions with different IDs, the merge pass retains the earlier-assigned ID and records the alias.

---

### CONTENT RULES

CONTENT is a reconstruction, not a summary. Apply in order:

1. **Direct quote first.** If the source has exact text, reproduce it verbatim. Wrap in `"quotes"` and tag `[VERBATIM]`.
2. **Paraphrase only when a direct quote is impossible** (e.g., spread across multiple messages). Paraphrase must preserve: all proper nouns, all numbers and dates, all named tools/platforms/people, all explicit decisions or conclusions. Do not abstract these into categories.
3. **Minimum specificity floor:** A paraphrase that loses a specific name, number, or platform reference fails. "Several compliance gaps were noted" is a collapse — name each gap. "Kyle mentioned tools he uses" is a collapse — list the tools named.
4. **Length is not a compression signal.** A faithful reconstruction of a 10-point list is 10 lines. Do not compress it to 3.
5. **Preserve gaps.** If content is partially illegible or ambiguous, reproduce what is recoverable and mark gaps with `[ILLEGIBLE]` or `[UNCLEAR: best guess]`. Do not smooth over them.

---

### ANTI-COLLAPSE RULES

These prevent the most common extraction failure: compressing multiple distinct items into one entry.

**Rule 1 — One item, one entry.** Each scene seed, decision, artifact, and blocker is its own entry. If 5 decisions were made in one session, that is 5 entries, not 1.

**Rule 2 — Lists stay lists.** Each item in a numbered or bulleted list becomes its own extraction entry unless the list itself is explicitly the unit (e.g., a ranked priority list). Do not summarize a list as "a number of items were discussed."

**Rule 3 — Do not infer unity.** Two items that seem related are still two entries unless the source explicitly treats them as one. The merge pass decides what belongs together — not the extractor.

**Rule 4 — Partial beats collapsed.** If you can only recover part of an item, extract the partial and tag `[INCOMPLETE]`. Do not pad it with inference to make it look complete.

**Rule 5 — "Mentioned" is extractable.** If a source says "Kyle mentioned wanting to build X," extract it as a candidate entry tagged `[NEEDS KYLE CONFIRMATION]`. Do not discard it for vagueness. Do not upgrade it to a confirmed decision either.

---

### DEDUPLICATION RULE
If you find the same decision, scene seed, fact, or artifact mentioned in more than one place:
- Merge into a single entry
- Use the most complete / most recent version as the primary
- Note all source locations
- Tag `[MERGED FROM: X sources]`

---

### AFTER EXTRACTION: PRODUCE TWO OUTPUTS

**OUTPUT 1 — MARKDOWN ARCHIVE (`extraction-[source-name].md`)**

A clean, human-readable document organized by lane. This is for reading, reviewing, deciding what to keep.

Structure:
```
# Extraction Archive — [Source Name]
## Extracted: [Date]
## Total items: [N]

---

## MEMOIR ([N] items)
[all memoir entries]

## FLASHFUSION ([N] items)
[all flashfusion entries]

## CHAOSCLUB ([N] items)
[all chaosclub entries]

## PERSONAL ([N] items)
[all personal entries]

## ARTIFACTS ([N] items)
[all artifacts entries]

## DECISIONS ([N] items)
[all decisions entries]

## BLOCKERS ([N] items)
[all blockers entries]
```

---

**OUTPUT 2 — CONTEXT CAPSULE (`ExtractionCapsule_[SourceName].jsx`)**

A JSX SESSION_SEED constant for pasting as a cold-start in a new Claude project. This is for migration — not reading.

```jsx
// ExtractionCapsule_[SourceName].jsx
// Generated: [Date]
// Paste as first message in new project session
// ID format: [LANE_PREFIX]-[slug]-[seq] — IDs are stable across merge passes

export const SESSION_SEED = {
  source: "[source name]",
  extractedAt: "[date]",
  memoir: [
    // { id: "MEMO-[slug]-[seq]", content: "", tags: [], source: "" }
  ],
  flashfusion: [
    // { id: "FFUS-[slug]-[seq]", content: "", tags: [], source: "" }
  ],
  chaosclub: [
    // { id: "CCCO-[slug]-[seq]", content: "", tags: [], source: "" }
  ],
  personal: [
    // { id: "PERS-[slug]-[seq]", content: "", tags: [], source: "" }
  ],
  artifacts: [
    // { id: "ARTF-[slug]-[seq]", filename: "", description: "", tags: [], source: "" }
  ],
  decisions: [
    // { id: "DCSN-[slug]-[seq]", decision: "", context: "", tags: [], source: "" }
  ],
  blockers: [
    // { id: "BLKR-[slug]-[seq]", blocker: "", dependency: "", tags: [], source: "" }
  ],
}
```

---

## MERGE PASS (run after collecting all individual extractions)

Once you have run the extraction prompt on every source, paste all the markdown outputs into a single session and run this:

---

You are receiving multiple extraction archives from different Claude chats, projects, and files. Your job is to merge them into one unified archive.

**Rules:**
1. Deduplicate across all sources — same item mentioned in 3 sources becomes 1 entry tagged `[MERGED FROM: 3 sources]`
2. On conflict, keep the most recent version. Note the conflict with `[CONFLICT: older version said X]`
3. On contradiction, keep both versions and tag `[CONTRADICTION — needs Kyle review]`
4. Do not evaluate, prioritize, or editorialize. Extract everything, Kyle filters.
5. Preserve all source attribution.

**Produce:**
- One merged `PROJECT_STATE_REBUILT.md` covering all lanes
- One merged `SESSION_SEED_MASTER.jsx` for project cold-start
- A `CONFLICTS_AND_GAPS.md` listing anything that needs Kyle's explicit decision

---

## CONNECTOR-SPECIFIC ADDENDUM

If extracting from connectors, append this to the base prompt:

**For Notion:** Search for pages containing: memoir, book, scene, O'Tooles, Kinsley, FlashFusion decisions, Chaos Club, skills library, session notes, tool archaeology. Extract page titles, last-edited dates, and full content.

**For Google Drive:** Search for: memoir, primary source, journal, excavation, scene seed, project state, skills library, chaos club manuscript. Extract doc titles, dates, and full text of relevant docs.

**For n8n:** List all workflows with name, ID, active/inactive status, last-run date, and description. Flag any with broken credentials or unwired HTTP nodes.

**For Airtable / Base44:** Extract schema names, record counts, last-modified dates, and any records with memoir or book-related content.

---

*Extraction Prompt v1.2 — Kyle Rosebrook — April 2026*
*Built for post-nuke project rebuild. Run per-source, then run merge pass.*
