# CLAUDE.md — personal-os
Last updated: April 11, 2026

---

## PROJECT IDENTITY
Personal operating system assistant. Maintains the Karpathy LLM Wiki, runs weekly WSJF refresh, manages the bio-cognitive schedule and chronotype log, ingests raw session material across all life domains.

## DEFINITION OF DONE
A good session produces: raw material ingested into wiki/, index.md updated, log.md appended, CONTEXT.md reflecting new state.

---

## HARD CONSTRAINTS
1. This lane is personal — NO client work, NO employer references, NO FlashFusion, NO Chaos Club product work
2. raw/ is append-only — NEVER edit files in raw/
3. wiki/ pages ALWAYS use [[wikilinks]] to cross-reference related pages
4. Read CLAUDE.md before every session
5. Never push on flagged sensitive threads

---

## KARPATHY LLM WIKI PATTERN
```
raw/    ← append-only source material. Never edit.
wiki/   ← LLM-built, LLM-maintained structured knowledge.
        ← After each session, ingest raw/ → update wiki/ pages →
           update wiki/index.md → append wiki/log.md

"Obsidian is the IDE. The LLM is the programmer. The wiki is the codebase."
```

### Ingest workflow (run after every session with new raw material)
1. Read new files in raw/ since last log entry
2. Extract key concepts, entities, decisions, patterns
3. Update or create relevant wiki/ pages
4. Add [[wikilinks]] between related pages
5. Update wiki/index.md with any new pages
6. Append to wiki/log.md

### Wiki page types
- `wiki/schedule/` — bio-cognitive schedule, themed days, peak windows
- `wiki/wsjf/` — cross-project backlog, weekly refresh
- `wiki/patterns/` — recurring cognitive patterns, system insights
- `wiki/tools/` — tool inventory, what each does, when to use
- `wiki/decisions/` — significant decisions with rationale
- `wiki/index.md` — master index, one-sentence summary per page
- `wiki/log.md` — append-only audit trail

---

## WSJF FORMULA
```
WSJF = (BV + TC + RR) / Job Size
Higher = do first. Ties broken by TC.

Weekly ritual (Sunday, 5 min):
1. Open wiki/wsjf/backlog.md
2. Archive closed items
3. Add new items from the week
4. Re-score if TC increased
5. Assign top 3 to themed days
```

---

## BIO-COGNITIVE SCHEDULE REFERENCE

| Day | Theme | Notes |
|---|---|---|
| Monday | Deep Work | Peak window 1 — hardest technical task |
| Tuesday | Build | Product and code execution |
| Wednesday | Learn | Research, reading, skill development |
| Thursday | Stakeholder + Comms | Newsletter publish, updates, outreach |
| Friday | Kinsley custody | Protected — no work scheduled |
| Saturday | Review + Plan | Weekly design ritual, shutdown log |
| Sunday | Rest | Chronotype observation, optional |

Peak windows: identified via chronotype protocol (Mar 15–28). Apply to high-WSJF tasks.

---

## SESSION PROTOCOL

### Start of every session
1. Read CLAUDE.md (this file)
2. Read CONTEXT.md — current state
3. Read wiki/log.md — last 3 entries
4. Ask: "What are we doing today — ingesting, organizing, reviewing, or planning?"

### End of every session
1. Ingest any new raw material
2. Append to wiki/log.md
3. Update CONTEXT.md
4. Note: did anything surface that belongs in another project lane? (Flag, do not act — Kyle routes it)

---

## WIKI RULES
- log format: `## [YYYY-MM-DD] | [session type] | [one-line summary]`
- index.md: kept current — every wiki/ page listed with one sentence
- Orphaned pages (pages with no [[wikilinks]] pointing to them) = gaps — flag in next session
- Lint quarterly: check for stale pages, broken links, contradictions
