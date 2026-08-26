# Universal Project Context Extractor
## Drop this prompt into any Claude project to extract a structured zip of relevant materials

---

## THE PROMPT

Copy everything below the line and paste it as a message in any Claude project.

---

```
I need you to extract and package all relevant context from this project into a downloadable zip file. This is for a cross-project build: I'm creating an interactive multi-model AI assessment tool for HumanX 2026 (enterprise AI conference, April 6-9, Moscone Center South, San Francisco).

## WHAT I'M BUILDING

An interactive web application where conference attendees (vendors, MSP peers, potential clients, partners) scan a QR code and receive a personalized multi-tenant AI architecture assessment. The app uses:

- **Claude API** — Analysis engine: scores their infrastructure against a vendor comparison matrix, generates written recommendations
- **Gemini 3 Pro Image API** — Generates custom architecture diagrams with text labels based on their specific answers
- **Gemini TTS API** — Generates audio walkthrough of their assessment they can listen to on the expo floor
- **Gemini Veo 3.1 API** — (Stretch) Short animated explainer of their recommended isolation pattern
- **Imagen 4 API** — Branded visual assets (compliance badges, vendor logos, report headers)
- **Microsoft Copilot** — (Optional) Export assessment to PowerPoint/Excel for enterprise buyers to take home

The assessment covers: multi-tenant data isolation patterns, encryption models, AI data exposure controls, compliance automation (HIPAA/SOC 2/CMMC), and MSP-specific architecture decisions.

## YOUR TASK

### Step 1: Search this project's conversation history
Use conversation_search and recent_chats tools to find ALL conversations related to:

**Primary keywords (search each separately):**
- "multi-tenant isolation" OR "tenant isolation" OR "data isolation"
- "vendor comparison" OR "vendor matrix" OR "vendor evaluation"
- "architecture" OR "infrastructure" OR "data vault"
- "Skyflow" OR "Commvault" OR "CockroachDB" OR "Snowflake"
- "compliance" OR "HIPAA" OR "SOC 2" OR "CMMC"
- "MSP" OR "managed services" OR "client data"
- "HumanX" OR "conference" OR "SolutionBridge"
- "InVelo" OR "catalyst" OR "mission-complete"
- "Data Venue" OR "data venue" OR "privacy vault"
- "encryption" OR "RLS" OR "row-level security"
- "Gemini" OR "image generation" OR "generative"
- "React" OR "Next.js" OR "Vercel" OR "Supabase"
- "presentation" OR "deck" OR "pitch" OR "demo"
- "INT Inc" OR "INT OS" OR "Dotty"
- "Dave" OR "Jackie" OR "Daniel" OR "leadership"
- "API" OR "Claude API" OR "web search" OR "agent"

### Step 2: Extract and categorize
For each relevant conversation found, extract:

1. **Chat metadata** — Title, URL, date, relevance score (1-5)
2. **Key content** — The actual useful information (not the full transcript, just the actionable parts):
   - Architecture decisions or patterns discussed
   - Vendor data (pricing, capabilities, comparisons)
   - Technical specifications (schemas, APIs, code patterns)
   - Strategic positioning (messaging, audience, framing)
   - Design assets or brand guidelines mentioned
   - Research findings with citations
   - Code snippets or working implementations
   - Stakeholder context (what Dave/Jackie/Daniel care about)

3. **Artifacts or files** — If any conversations produced downloadable files, note their names and what they contain

### Step 3: Create structured output files

Create these files and package them into a zip:

**1. `00_MANIFEST.md`**
- Master index of everything extracted
- Organized by category with relevance scores
- Cross-references between related materials
- Gaps identified (what's missing that the assessment tool needs)

**2. `01_ARCHITECTURE_CONTEXT.md`**
- All multi-tenant isolation patterns discussed
- Vendor comparison data (Skyflow, Commvault, AWS, Snowflake, CockroachDB, PlanetScale)
- Schema designs, RLS patterns, encryption models
- Architecture decision rationale

**3. `02_VENDOR_INTELLIGENCE.md`**
- Per-vendor capability summaries
- Pricing data found
- Competitive positioning
- HumanX booth/meeting strategy per vendor
- Questions prepared per vendor

**4. `03_STRATEGIC_POSITIONING.md`**
- How Data Venue / InVelo is positioned for different audiences
- Messaging frameworks (vendor partners, MSP peers, leadership, clients)
- Brand guidelines, color palettes, design language
- Stakeholder mapping (Dave, Jackie, Daniel, Gwen — what each cares about)

**5. `04_TECHNICAL_ASSETS.md`**
- Code snippets (React components, API patterns, schema definitions)
- Working implementations referenced
- Deployment configurations (Vercel, Supabase, etc.)
- API integration patterns (Claude API, Gemini API usage)

**6. `05_RESEARCH_CITATIONS.md`**
- All verified statistics and their sources
- Market data (Gartner, BCG, McKinsey, Forrester, etc.)
- Pricing benchmarks
- Industry trends referenced

**7. `06_HUMANX_PREP.md`**
- Conference-specific materials found
- SolutionBridge application details
- Expo hall strategy
- Peer networking frameworks
- Budget estimates and ROI calculations

**8. `07_GEMINI_CAPABILITIES.md`**
- Any discussions about Gemini's generative capabilities
- Image generation patterns or experiments
- Video generation context
- TTS/voice patterns
- Multi-model orchestration approaches discussed

**9. `08_GAPS_AND_NEEDS.md`**
- What this project has that the assessment tool needs
- What's missing that other projects might have
- Open questions that need answers
- Decisions that haven't been made yet

### Step 4: Package and deliver

Create all files in /home/claude/, then:
```bash
cd /home/claude
zip -r /mnt/user-data/outputs/ProjectExtract_[PROJECT_NAME]_$(date +%Y%m%d).zip \
  00_MANIFEST.md 01_ARCHITECTURE_CONTEXT.md 02_VENDOR_INTELLIGENCE.md \
  03_STRATEGIC_POSITIONING.md 04_TECHNICAL_ASSETS.md 05_RESEARCH_CITATIONS.md \
  06_HUMANX_PREP.md 07_GEMINI_CAPABILITIES.md 08_GAPS_AND_NEEDS.md
```

Present the zip file for download.

## QUALITY REQUIREMENTS

- **No hallucination.** If you didn't find it in conversations, say "NOT FOUND IN THIS PROJECT" rather than making it up.
- **Citation format.** For every piece of information, include which conversation it came from (chat URL or title + date).
- **Relevance filtering.** Only include information that's actually useful for building the assessment tool. Skip tangential discussions.
- **Deduplication.** If the same information appears in multiple conversations, consolidate to the best version with all sources noted.
- **Completeness signal.** At the end of each file, state: "Searched X conversations. Found Y relevant. Confidence: HIGH/MEDIUM/LOW that this project contains more relevant context."

## IMPORTANT NOTES

- This project may or may not contain all categories above. That's fine — extract what exists and clearly mark what's missing.
- The zip from THIS project will be combined with zips from OTHER projects. The manifest helps me merge without duplicating.
- Prioritize actionable information (code, data, decisions) over discussion summaries.
- If you find references to other Claude projects or conversations outside this project, note them in 08_GAPS_AND_NEEDS.md so I know where to look next.

Begin extraction now. Search broadly first, then filter ruthlessly.
```

---

## USAGE INSTRUCTIONS

1. **Copy the prompt above** (everything between the ``` markers)
2. **Open any Claude project** that might have relevant context
3. **Paste and send** — Claude will search, extract, and package
4. **Download the zip** from each project
5. **Bring all zips back to this project** for synthesis and build

### Which projects to run this in:
- This INT Inc. project (primary — most HumanX + Data Venue context)
- InVelo project (if separate — InVelo positioning, financial models, pitch deck)
- Any project with Gemini/multi-model discussions
- Any project with React/Next.js/Vercel deployment patterns
- Any project with enterprise AI platform comparisons

### After extraction:
Upload all zips to this conversation and say:
> "Here are the extracts from [N] projects. Synthesize into a unified context package for the assessment tool build."

---

## FRAMEWORK NOTES

This prompt uses a hybrid of:
- **CRISPE** (Capacity, Role, Insight, Statement, Personality, Experiment) — Claude acts as a research analyst with specific extraction criteria
- **CONTRACT** (Context, Objectives, Norms, Tasks, Requirements, Actions, Constraints, Testing) — structured deliverable spec with quality gates
- **STAR** (Situation, Task, Action, Result) — each extracted item maps to: what was the situation, what was discussed, what was decided, what's the usable artifact

The 9-file structure ensures no context is lost while keeping files focused enough to be individually useful during the build phase.
