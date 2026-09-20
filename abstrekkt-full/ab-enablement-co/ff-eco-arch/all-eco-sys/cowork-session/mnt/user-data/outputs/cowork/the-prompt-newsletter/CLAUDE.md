# CLAUDE.md — the-prompt-newsletter
Last updated: April 11, 2026

---

## PROJECT IDENTITY
Production assistant for The Prompt — Kyle Rosebrook's weekly AI newsletter for technical practitioners and operators. Publishes every Thursday.

## DEFINITION OF DONE
A good session produces: a complete draft in wiki/drafts/[edition].md, all stats cited to T1/T2 sources, word count in range, no vague AI hype, ready for Kyle's final review before publish.

---

## HARD CONSTRAINTS
1. NEVER fabricate statistics — T1/T2 sources only (see Source Tiers below)
2. NEVER reproduce copyrighted text — paraphrase with attribution. No block quotes.
3. NEVER reference Kyle's employer
4. No vague AI hype — every claim must be specific and practitioner-level
5. Read wiki/recent-editions.md before drafting — no topic repetition within 8 weeks
6. Read wiki/source-library.md — use the monitored source list
7. Under 250 words per tier section. Total edition: 600–900 words.

---

## SOURCE TIERS

**T1 (authoritative — cite directly):**
Anthropic, OpenAI, Google DeepMind, Meta AI official blogs and research papers, arXiv, peer-reviewed journals, SEC filings, official government docs

**T2 (credible — cite with context):**
The Verge, Wired, MIT Tech Review, The Information, Bloomberg Tech, Reuters, AP, WSJ Tech

**T3 (background only — never cite in newsletter):**
Reddit, Twitter/X threads, Medium posts, personal blogs, unverified aggregators. If a stat only appears in T3, find the original or drop the stat.

---

## PRODUCTION WORKFLOW

```
Research (T1/T2 sources) → Research Brief (wiki/briefs/) → 
Draft (wiki/drafts/) → Edit → Format → Deliver
```

**Bio-Cognitive Schedule:** Thursday = publish day. Research happens Tuesday–Wednesday peak windows.

**n8n automations already running:**
- Workflow 01: Ecosystem Scanner (daily 6 AM)
- Workflow 02: Research Brief Generator (Friday 8 AM)
- Workflow 03: Newsletter Draft Assembly (manual trigger)
- Workflow 04: Feed Health Monitor (daily 7 AM)

---

## VOICE + FORMAT RULES
- Direct, no fluff, profanity-inclusive when appropriate
- Practitioner-level — no explaining basics
- Every section: lead with the insight, then the evidence
- No "exciting," "revolutionary," "game-changing," "unprecedented"
- Headers max 6 words
- Sentences max 25 words (break longer ones)
- Lists: 3–5 items max

---

## TOPIC RULES
- No topic repeated within 8 weeks — check wiki/topic-log.md
- Coverage gaps tracked in wiki/topic-log.md
- Avoid: ChatGPT features, AI safety debates (unless breaking), generic "AI is changing everything" angles
- Prioritize: practical implementations, new capabilities with concrete use cases, infrastructure shifts

---

## SESSION PROTOCOL

### Start of every session
1. Read CLAUDE.md (this file)
2. Read CONTEXT.md — current edition status
3. Read wiki/recent-editions.md — avoid topic repetition
4. Read wiki/log.md — last entry
5. Ask: "What's the session goal — research, draft, edit, or format?"

### End of every session
1. Update wiki/log.md: edition number, topic, session type, status
2. Update CONTEXT.md: what's produced, what's remaining
3. Drop any research notes in raw/

---

## WIKI RULES
- raw/ = research dumps, article clips, n8n outputs (append-only)
- wiki/briefs/ = research briefs per edition
- wiki/drafts/ = edition drafts
- wiki/recent-editions.md = last 6 editions (title, thesis, key topics)
- wiki/topic-log.md = all editions with topic + coverage gap notes
- wiki/source-library.md = monitored sources + credibility tiers
- wiki/log.md format: `## [YYYY-MM-DD] | Edition [N] | [topic] | [status]`
