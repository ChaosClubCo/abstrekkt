# AI Cross-Reference — Project Extractor
**Drop this entire prompt into any Claude project. It searches, extracts, and produces a finished inventory you can bring back to the INT project.**

---

I need you to audit this project's entire conversation history and produce a complete inventory of everything that's been built, designed, planned, or discussed here.

Search the conversation history thoroughly. Run at least 15-20 searches using terms like: platform, skills, deployment, production, tool, app, framework, prompt, document, architecture, security, pricing, revenue, model, dashboard, assessment, playbook, integration, API, database, Supabase, React, Next.js, Vercel, Claude, pipeline, automation, audit, compliance, governance, and any other terms that surface as you go. Also pull the 20 most recent conversations to catch anything keyword searches miss.

For every deliverable, build, tool, document, framework, or asset you find, I need:

**Name** | **Status** (Production / Deployed / Complete / In Flight / Designed / Planned) | **What it does** (1 sentence) | **Tech stack if applicable** | **Link to the conversation where it was last discussed**

Group them under these categories:
- **Platform & Infrastructure** — Apps, APIs, databases, deployment pipelines
- **Revenue & Offerings** — Pitch decks, pricing models, financial projections, service packages
- **Conference & Sales Tools** — Assessment tools, lead capture, conversation scripts, briefs
- **Enablement & Internal** — Training materials, stakeholder packages, knowledge bases, frameworks
- **Architecture & Strategy** — Prototypes, design documents, strategic plans, security patterns

After the inventory, add three sections:

**STATUS CHANGES** — Anything that moved forward since it was first discussed (e.g., went from "planned" to "built"). Note what changed and when.

**GAPS** — Anything referenced as "not yet built," "needs packaging," "planned but not started," or "methodology exists but not formalized." For each gap, note what exists today and what's missing.

**SURPRISES** — Anything you found that I might have forgotten about or that doesn't obviously fit the categories above. This is the most important section — surface the stuff that's easy to overlook.

Be exhaustive. Run every search. Include everything, even small tools or one-off documents. It's better to over-include than to miss something. Use the project's own language for names — don't rename anything.

Format the entire output as clean markdown I can copy-paste into another conversation.
