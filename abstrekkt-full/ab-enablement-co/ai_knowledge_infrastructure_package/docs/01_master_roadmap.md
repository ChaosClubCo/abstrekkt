# AI Knowledge Infrastructure Roadmap

Generated: May 11, 2026

Purpose: Convert hundreds of artifacts into operational memory, provenance-aware asset graphs, and agent-accessible business memory for an AI enablement platform.

## Executive Summary

This roadmap converts a scattered artifact universe into AI knowledge infrastructure: a governed, searchable, provenance-aware, agent-accessible memory system for a business AI enablement platform. The goal is not to make your files look tidy; the goal is to make every artifact discoverable, trustworthy, reusable, and connected to revenue, delivery, product, training, and operational outcomes.

The recommended architecture is metadata-first and graph-aware. Raw files remain in storage, while the intelligence layer lives in a database and relationship map that knows what each asset is, where it came from, what it supports, which workflows use it, what risks it carries, and which agents are allowed to retrieve or act on it.

Success means you can ask: “Show me every client-ready artifact for a business AI audit in a services company, including supporting SOPs, demo HTML pages, videos, prompts, dependencies, provenance, and next actions,” and the system returns a ranked, explainable, permission-safe answer.

## Target Success Criteria

The finished system must satisfy four success criteria.

1. AI knowledge infrastructure: artifacts become structured knowledge assets with stable IDs, metadata, searchable summaries, embeddings, business tags, and lifecycle states.

2. Operational memory systems: your business remembers work across projects, sources, agents, clients, tools, and conversations. Memory is not passive notes; it is structured, queryable, auditable context that helps decide what to reuse, what to improve, and what to ship.

3. Provenance-aware asset graphs: each asset records where it came from, who or what created it, which tool generated it, which files it depends on, what it was derived from, how it changed, and why it can or cannot be trusted.

4. Agent-accessible business memory: approved agents can retrieve assets, inspect context, recommend next actions, generate deliverables, and route work without guessing or leaking private information.

## Grounded Architecture Thesis

The strongest pattern is Asset -> Metadata -> Provenance -> Relationships -> Workflow -> Agent Access -> Business Outcome.

Traditional folder structures fail because one asset can serve many business roles. A single HTML demo may be a product feature candidate, sales demo, client training artifact, onboarding walkthrough, and internal QA sample. A folder can only put it in one place. A graph can represent all of those relationships at once.

Current DAM guidance emphasizes metadata, taxonomy, governance, AI tagging, workflow integration, and controlled vocabularies. Provenance standards such as W3C PROV model entities, activities, and agents. AI risk frameworks such as NIST AI RMF give you a governance backbone. OWASP’s LLM risk categories give you security test classes for prompt injection, data exposure, tool misuse, and retrieval weakness. Supabase pgvector gives you a practical path for semantic search. Neo4j-style graphs give you a path for relationship reasoning when the asset universe becomes too connected for simple relational tables.

The practical conclusion: build a relational metadata registry now, add vector search early, add graph relationships from day one, and postpone heavy graph infrastructure until relationship queries outgrow Postgres.

## The Six Business Layers

Use six layers as the first stable classification system.

Revenue Layer: assets that sell the platform or service. Includes landing pages, proposal snippets, pricing graphics, demo videos, case study pages, pitch decks, ROI visuals, and social proof.

Delivery Layer: assets that help deliver paid work. Includes intake forms, audit checklists, automation maps, SOPs, training sessions, client dashboards, meeting agendas, implementation scripts, and rollout guides.

Product Layer: assets that could become platform features. Includes interactable HTML pages, calculators, dashboards, prompt tools, agent panels, client portals, intake modules, UI components, and data visualizations.

Knowledge Layer: assets that teach, explain, or preserve know-how. Includes frameworks, companion guides, FAQs, tutorials, NotebookLM prompts, Gemini research prompts, Claude project instructions, and internal doctrine.

Brand and Creative Layer: assets that shape identity and presentation. Includes graphics, hero images, videos, icons, logos, style tiles, UI mockups, motion studies, visual language boards, and social content.

Archive and Research Layer: assets that are useful but not ready or currently needed. Includes incomplete prototypes, duplicate experiments, obsolete drafts, old versions, abandoned concepts, and raw research material.

## Platform Module Map

Map every artifact to one or more platform modules. This is where the dots connect.

Business AI Audit: intake, discovery, current-state mapping, pain-point scoring, manual-work cost analysis, risk assessment, readiness scoring.

Manual Work Cost Calculator: calculators, forms, spreadsheets, ROI screenshots, labor-cost models, benchmark templates.

AI Opportunity Finder: opportunity forms, scoring rubrics, industry-specific playbooks, process-mining prompts, prioritization matrices.

Workflow Automation Builder: n8n/Make/Zapier workflows, SOP-to-automation converters, handoff diagrams, approval gates, fallback playbooks.

Company Brain: knowledge base, retrieval policies, source maps, document ingestion, memory hygiene, workspace search, source-of-truth governance.

AI Training Academy: tutorials, micro-lessons, onboarding guides, executive training, frontline training, role-based prompt packs, quiz content.

Prompt and Agent Library: agent cards, reusable prompts, tool instructions, prompt QA criteria, safety policies, model-routing instructions.

Client Dashboard: delivery status pages, KPI boards, ROI tracker, issue log, training progress, asset browser, approval queue.

ROI Tracker: baseline metrics, before/after measurements, attribution notes, revenue/cost/time savings, benchmark checkpoint templates.

Case Study Generator: proof capture, before/after story builder, metric validation, quote intake, visual case study layouts.

SOP Generator: process capture, role maps, exception handling, escalation logic, tooltips, screenshots, training-ready workflows.

AI Adoption Roadmap: maturity model, 30/60/90-day plan, stakeholder map, governance checklist, tool rollout sequence.

Department-Specific Kits: sales, operations, service, HR, finance, marketing, IT, leadership, support, and field-team kits.

Sales Enablement Kit: outreach copy, proposal generator, demo scripts, pricing logic, objection handling, discovery-call assets.

Internal Ops Automation Kit: your own reusable operating system for artifact intake, classification, scoring, backlog creation, and follow-up.

## Reference Architecture

The recommended build has seven layers.

Layer 1: Raw storage. Keep files in Google Drive, OneDrive, local drive, Supabase Storage, Cloudflare R2, GitHub, or a DAM. Storage should not be the source of intelligence.

Layer 2: Asset registry. Use a database table where every asset gets an immutable asset_id, path, type, status, owner, source, checksum, and lifecycle state.

Layer 3: Metadata and taxonomy. Add controlled vocabularies, business layer, module, audience, client use case, sensitivity, quality, reuse score, product potential, delivery potential, revenue potential, and required review level.

Layer 4: Provenance and lineage. Track creator, source tool, generation prompt, model/tool version when available, input assets, output assets, derivative relationships, approvals, edit history, and confidence level.

Layer 5: Semantic search. Generate summaries and embeddings for searchable content. Use the same embedding model for comparable vectors. Keep embedding jobs synced when files change.

Layer 6: Relationship graph. Track supports, depends_on, derived_from, replaces, duplicates, used_in, teaches, markets, automates, references, belongs_to, blocks, and unlocks.

Layer 7: Agent access and workflow UI. Let agents query approved memory through scoped retrieval tools, not by crawling everything. Build dashboards only after inventory, metadata, provenance, and retrieval rules are stable.

## Recommended Stack

Recommended MVP stack:

Frontend: Next.js, React, Tailwind, shadcn/ui.

Database: Supabase Postgres with Row Level Security.

Vector search: Supabase pgvector.

Storage: Supabase Storage for app-managed assets, Cloudflare R2 for large media, Google Drive/OneDrive for existing corpora during migration.

Metadata extraction: scripts for filename/path/type/checksum, plus AI classification for summaries, tags, business layer, module, risk, and next action.

Graph relationships: Postgres relationship table first; Neo4j later only when relationship traversal becomes a product requirement.

Automation: n8n or Make for intake, classification queues, review reminders, metadata sync, and weekly governance reports.

AI providers: Claude for long-form reasoning and classification; Gemini for multimodal asset review; OpenAI or comparable embedding provider for vector search; local scripts for deterministic extraction.

Observability: Sentry for app errors, PostHog for product analytics, structured logs for ingestion jobs, and provenance logs for every agent action.

## Phased Roadmap

Phase 0 - Scope Lock and Safety Baseline, 1-2 days. Define asset sources, forbidden actions, privacy rules, naming rules, and deletion policy. No file moves. No destructive cleanup.

Phase 1 - Inventory, 3-7 days. Scan sources and create a complete asset registry. Extract path, filename, extension, size, checksum, created/modified timestamps, inferred type, and source location. Assign a temporary status of unreviewed.

Phase 2 - Classification, 3-10 days. Use AI-assisted classification to assign business layer, platform module, audience, use case, quality score, reuse score, revenue potential, delivery potential, product potential, risk level, and next action. Human-review only low-confidence/high-impact items.

Phase 3 - Provenance Capture, 3-10 days. Record source tool, creator, generation method, input assets, derivative relationships, edit history, claims, confidence, and approval state. Use W3C PROV concepts as the conceptual model: entity, activity, agent.

Phase 4 - Relationship Mapping, 5-14 days. Create asset_relationships records. Link demos to SOPs, prompts to tools, videos to tutorials, dashboards to delivery workflows, sales assets to case studies, and prototypes to product modules.

Phase 5 - Semantic Retrieval, 3-10 days. Generate asset summaries, chunk text assets, embed searchable content, and test hybrid search. Add retrieval rules so agents only see assets allowed by sensitivity and workflow context.

Phase 6 - Dashboard and Review Queues, 5-14 days. Build a simple UI for inventory browsing, filters, asset detail pages, relationship graph views, review queues, duplicate resolution, and top-value asset surfacing.

Phase 7 - Agent-Accessible Memory, 7-21 days. Add scoped retrieval endpoints for agents. Agents should query asset memory, inspect provenance, recommend next steps, and generate client deliverables only from approved or explicitly reviewed context.

Phase 8 - Operationalization, ongoing. Run weekly governance, update stale embeddings, close review queues, reconcile storage drift, and convert top assets into packaged offerings.

## 30-Day Execution Plan

Week 1: Build the inventory spine. Create the database schema, asset ID strategy, ingestion scripts, source registry, status fields, and initial CSV import. Do not move files. Do not build the fancy UI yet.

Week 2: Add classification and scoring. Process one source at a time. Generate summaries, business layer, module, status, scores, risks, and next actions. Review the top 100 highest-potential assets manually.

Week 3: Add provenance and relationships. Link duplicate assets, derivatives, versions, supporting guides, prompts, templates, videos, and client use cases. Create the first asset graph view using relationship records.

Week 4: Add retrieval and actionability. Create semantic search, agent access rules, dashboard filters, saved views, and weekly operating rhythm. Package the first 3 client-ready modules: Business AI Audit, Manual Work Cost Calculator, and AI Adoption Roadmap.

## 90-Day Maturity Plan

By day 30, the system should know what assets exist and what they are good for.

By day 60, the system should know how assets relate to each other, which modules they support, and which assets are client-ready.

By day 90, the system should support agent-accessible business memory: scoped retrieval, provenance inspection, workflow recommendations, deliverable generation, and feedback loops.

At day 90, you should be able to run a client discovery call, select an industry and business problem, and have the system assemble the correct audit prompts, intake forms, dashboard demos, proposal copy, training modules, and implementation checklist with provenance and review status attached.

## Data Model Blueprint

Minimum tables:

asset_sources: external roots such as Google Drive folders, local drives, repositories, upload libraries, Notion databases, Dropbox roots, or Cloudflare R2 buckets.

assets: the canonical registry. One row per artifact. Includes asset_id, title, type, storage_uri, checksum, source_id, status, sensitivity, owner, summary, quality_score, reuse_score, and lifecycle state.

asset_metadata: structured tags and extended fields. Includes business_layer, platform_modules, audience, industry, department, client_use_case, toolchain, format, dependencies, risk_level, and next_action.

asset_relationships: from_asset_id, to_asset_id, relationship_type, confidence, evidence, created_by, and review_status.

provenance_events: entity/activity/agent-inspired event records. Includes asset_id, event_type, actor_type, actor_id, tool, prompt_hash, source_asset_ids, timestamp, notes, and confidence.

asset_chunks: searchable chunks for long documents, HTML, transcripts, prompts, and guides.

asset_embeddings: vector records tied to asset_chunks or asset summaries.

agents: approved agents that can query memory.

agent_permissions: which agents can access which business layers, sensitivity levels, modules, actions, and tools.

review_queue: items needing human review.

workflow_runs: every ingestion, classification, embedding, relationship, and agent retrieval event.

## Controlled Vocabulary

Asset types:
html_page, interactive_artifact, image, graphic, video, animation, prompt, system_instruction, agent_card, sop, guide, checklist, spreadsheet, dashboard, code_repo, component, workflow, audio, transcript, research_note, proposal_asset, case_study, unknown.

Lifecycle states:
unreviewed, classified, needs_review, approved_internal, client_ready, product_candidate, sales_candidate, training_candidate, archived, deprecated, delete_candidate.

Sensitivity levels:
public, internal, client_confidential, private, secret_adjacent, restricted.

Relationship types:
supports, depends_on, derived_from, replaces, duplicates, used_in, teaches, markets, automates, references, belongs_to, blocks, unlocks, validates, contradicts, extends, version_of, generated_by, generated_from.

Review states:
not_reviewed, ai_reviewed, human_reviewed, approved, rejected, needs_followup.

## Success Metrics

Inventory coverage: at least 95% of known source roots scanned.

Classification coverage: at least 90% of assets assigned a business layer and asset type.

Review efficiency: only low-confidence, high-risk, or high-value assets require manual review.

Duplicate reduction: top duplicate clusters identified and resolved without destructive deletion.

Retrieval accuracy: top 10 retrieval results are relevant for 80%+ of benchmark queries by day 30 and 90%+ by day 90.

Provenance coverage: 70%+ of high-value assets have creator/source/tool/derivative lineage by day 60.

Agent safety: no restricted assets retrieved by unauthorized agents in security smoke tests.

Business impact: at least three client-ready modules packaged by day 30 and at least seven by day 90.

Operational memory: weekly review produces top stale assets, top ready assets, broken links, duplicate clusters, and recommended next actions.

## Unknown Unknowns and Blindspots

Unknown unknown: asset meaning may not be obvious from filename. Fix: use multimodal summaries, folder context, nearby files, and manual review for high-value uncertain assets.

Unknown unknown: some assets contain secrets, client info, or private notes. Fix: classify sensitivity before broad indexing, scan for secrets, and restrict retrieval until reviewed.

Unknown unknown: media assets may lack visible provenance. Fix: track source folder, upload source, checksums, generation prompts, edit chain, and C2PA manifests where available.

Unknown unknown: AI-generated summaries may hallucinate asset purpose. Fix: separate extracted facts from inferred use cases. Store confidence and evidence text.

Unknown unknown: embeddings can become stale after edits. Fix: use checksum/version triggers and embedding job retry logs.

Unknown unknown: multiple projects may use the same artifact differently. Fix: use many-to-many module relationships instead of forcing one category.

Unknown unknown: over-tagging can destroy usability. Fix: use controlled vocabularies for core fields and freeform notes only for secondary context.

Unknown unknown: a graph can become messy if every weak association is stored. Fix: require relationship_type, confidence, evidence, and review_status.

Unknown unknown: agents can misuse memory if retrieval scope is too broad. Fix: enforce module, sensitivity, status, and action-based permission filters.

Unknown unknown: your most valuable assets may be buried inside old experiments. Fix: score product_potential and delivery_potential independently from polish.

## Bottlenecks and Fixes

Bottleneck: hundreds of files and no clear starting point. Fix: begin with source registry and inventory-only pass.

Bottleneck: AI tools produce generic classifications. Fix: force specific business layers, modules, scores, evidence, and next action.

Bottleneck: too many manual review decisions. Fix: review by exception: high value, high risk, low confidence, or client-facing only.

Bottleneck: file movement creates broken links. Fix: keep storage stable until metadata registry is complete; migrate only after mapping.

Bottleneck: videos and images are hard to classify. Fix: use frame/thumbnail summaries, transcript extraction when possible, and asset-neighborhood context.

Bottleneck: prompts and docs duplicate each other. Fix: cluster by semantic similarity and choose canonical versions.

Bottleneck: graph work feels abstract. Fix: start with practical relationships: duplicates, derived_from, supports, used_in, belongs_to, replaces.

Bottleneck: agent access becomes risky. Fix: agents query approved retrieval endpoints, not raw folders.

## Pro Moves, Augmenters, and Hidden Gems

Pro move: create an asset_id that never changes even if the file moves. This turns your metadata layer into the true system of record.

Pro move: create a “golden asset” flag. These are the best examples of a module, style, workflow, or client deliverable.

Pro move: create a “remix candidate” status for rough assets with high product potential but low polish.

Pro move: store prompt_hash and model/tool version where possible. This helps identify which outputs came from which generation conditions.

Pro move: use relationship confidence. A weak AI-generated relationship should not carry the same trust as a human-approved dependency.

Pro move: add “evidence_excerpt” to every classification. This prevents black-box labels.

Pro move: create benchmark retrieval queries before building the dashboard. Search quality matters more than visual polish.

Pro move: use a weekly asset council ritual: promote, merge, archive, package, productize.

Hidden gem: the archive can become a product-idea mine. Do not delete old experiments until they are scored for future product potential.

Hidden gem: your prompt library is not just prompts; it is your operating doctrine. Link prompts to modules, agents, workflows, and deliverables.

Hidden gem: client-ready does not mean perfect. It means provenance is clear, risk is acceptable, next action is obvious, and the asset helps deliver an outcome.

Hidden gem: every case study should be generated from the asset graph. The system should know which intake, workflow, training, dashboard, and ROI tracker produced the outcome.

## Connected Dots You May Not Have Mapped Yet

Your artifact library can become your sales engine. The same asset graph that stores internal knowledge can assemble demos, proposals, case studies, onboarding paths, and training plans.

Your artifact library can become your delivery engine. Every client project should add new SOPs, before/after screenshots, training clips, automation templates, and benchmark data back into the memory system.

Your artifact library can become your product engine. The highest-reuse delivery assets should become platform modules. The most repeated prompts become agent tools. The most repeated workflows become packaged automations.

Your artifact library can become your personal cognitive infrastructure. Instead of trying to remember what you made, the system remembers asset purpose, context, quality, and next action.

Your artifact library can become your governance system. Provenance, sensitivity, permission, review status, and lineage stop agents from treating every file as equally trustworthy.

Your artifact library can become a moat. Competitors can copy tools, but not your accumulated map of business problems, deliverables, workflows, prompts, examples, outcomes, and provenance.

## Implementation Considerations

Build thin, useful layers. Do not start with an elaborate graph UI. Start with source registry, asset registry, classification, provenance, relationship records, search, and review queues.

Make the system inspectable. Every AI-generated classification needs evidence, confidence, and the ability to override it.

Separate source of file truth from source of knowledge truth. Google Drive, local disks, and R2 can hold files. Supabase should hold the canonical asset record.

Treat relationships as first-class data. A relationship without type, confidence, evidence, and review state will become noise.

Preserve unfinished work. Many of your strongest product ideas may be rough prototypes. Score value separately from polish.

Design for humans and agents. Humans need dashboards and review queues. Agents need scoped retrieval endpoints and action policies.

## Performance and Security Notes

Performance: avoid embedding everything repeatedly. Use checksums, modified timestamps, and embedding job records to reprocess only changed assets.

Performance: chunk long documents and transcripts, but store a separate asset-level summary for fast retrieval.

Performance: use hybrid search. Keyword search handles exact names and IDs; vector search handles intent.

Performance: defer Neo4j until graph queries become a real bottleneck. A Postgres relationship table is enough for the MVP.

Security: scan for secrets before indexing. Do not let agents retrieve private credentials, API keys, tokens, or client-sensitive material.

Security: enforce Row Level Security in Supabase and retrieval-time permission filters.

Security: defend against prompt injection in retrieved documents. Agents must treat asset content as untrusted context unless it comes from approved system instructions.

Security: maintain action boundaries. Retrieval agents can read. Mutation agents need explicit permissions and provenance logs.

Security: record every agent retrieval and mutation event. Operational memory should be auditable.

## Recommended Next Steps

Step 1: Create the source registry. List every place assets live: local drives, Google Drive, OneDrive, GitHub repos, ChatGPT artifacts, Notion, NotebookLM, videos, graphics folders, and web exports.

Step 2: Run inventory-only scan on one root. Do not move files. Generate file list, checksums, types, and current locations.

Step 3: Classify only the first source. Validate the taxonomy before scaling.

Step 4: Review the top 25 highest-potential assets. Decide what becomes client-ready, product candidate, sales asset, training candidate, or archive.

Step 5: Build the Supabase schema. Import the first inventory and make the asset registry real.

Step 6: Add semantic summaries and embeddings for text/HTML/prompts/docs first. Add images/videos later with multimodal passes.

Step 7: Add relationship mapping. Start with duplicates, derived_from, supports, used_in, and belongs_to.

Step 8: Build a minimal dashboard. Filters beat fancy visuals: layer, module, status, score, sensitivity, next action, and relationship count.

Step 9: Add scoped agent retrieval. Do not give agents full folder access.

Step 10: Package the first three modules into client-facing deliverables.

## Roadmap Acceptance Criteria

The roadmap is successful when:

A complete source registry exists.
At least one full source root is inventoried.
Every inventoried asset has asset_id, type, status, location, checksum, business layer, and next action.
At least 100 assets are classified and scored.
At least 25 high-value assets are manually reviewed.
At least 5 relationship types are actively used.
At least 20 provenance events are captured.
At least 10 benchmark search queries are tested.
No restricted assets appear in unauthorized retrieval tests.
At least 3 client-ready modules are assembled from the asset graph.
The weekly review ritual produces useful decisions.

## FAQ

Should I move files first? No. Moving files first creates broken links and false confidence. Inventory first.

Should I use Notion or Airtable instead of Supabase? Use them for lightweight planning if needed, but Supabase is stronger for app integration, permissions, embeddings, and agent-accessible APIs.

Do I need Neo4j immediately? No. Start with a relationship table in Postgres. Add Neo4j only when traversal, graph analytics, or visual graph exploration becomes essential.

Should every asset get embedded? No. Embed searchable text, summaries, transcripts, prompts, and documentation first. For images/video, embed summaries and transcripts before full multimodal indexing.

How do I avoid AI slop in the inventory? Require evidence, confidence, controlled vocabularies, and human review for high-impact assets.

What is the first productized output? Business AI Audit is the best first module because it turns messy client operations into a repeatable diagnosis, roadmap, and value-based proposal.

What should agents be allowed to do first? Search, summarize, recommend, and draft. Delay autonomous mutation until permissions, provenance, and rollback are stable.

## CLAIMS CHECK

SOURCED: NIST AI RMF provides a voluntary framework for AI risk management and is operationalized through Govern, Map, Measure, and Manage functions.

SOURCED: W3C PROV models provenance using concepts for entities, activities, and agents involved in producing data or things.

SOURCED: Supabase pgvector supports vector storage/similarity search in Postgres, and Supabase semantic search guidance stresses using the same embedding model for comparisons.

SOURCED: OWASP Top 10 for LLM Applications identifies risks such as prompt injection, insecure output handling, sensitive information disclosure, excessive agency, and vector/embedding weaknesses.

SOURCED: C2PA provides open technical standards for digital content provenance and authenticity.

GENERATED: The seven-layer architecture is a synthesized recommendation tailored to an AI enablement platform with many creative, product, and delivery artifacts.

COUNTEREXAMPLE: If the corpus remains small, a simple Notion/Airtable inventory with Google Drive links may be enough for the first month.

CONTRADICTION: Folder organization is still useful for human browsing, but it cannot represent the many-to-many relationships needed for agent-accessible business memory.

## References

- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework — Use Govern, Map, Measure, Manage as the governance backbone for AI systems and agentic workflows.

- NIST AI RMF Playbook: https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-playbook — Use as a source of suggested governance actions; not a rigid checklist.

- W3C PROV Data Model: https://www.w3.org/TR/prov-dm/ — Use PROV concepts of entities, activities, and agents for provenance-aware asset graphs.

- W3C PROV Overview: https://www.w3.org/TR/prov-overview/ — Use PROV family structure for interoperable provenance modeling.

- Supabase Semantic Search Docs: https://supabase.com/docs/guides/ai/semantic-search — Use same embedding model for comparable vector search; use semantic search for intent retrieval.

- Supabase pgvector Docs: https://supabase.com/docs/guides/database/extensions/pgvector — Use pgvector/vector extension for embedding storage and similarity search inside Postgres.

- Supabase Automatic Embeddings Docs: https://supabase.com/docs/guides/ai/automatic-embeddings — Track embedding synchronization, failures, and retries.

- Neo4j Knowledge Graph Generation: https://neo4j.com/blog/developer/knowledge-graph-generation/ — Use graph construction/retrieval patterns as context providers for GenAI applications.

- OWASP Top 10 for LLM Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications/ — Use prompt injection, sensitive data exposure, excessive agency, and vector weaknesses as security test classes.

- C2PA: https://c2pa.org/ — Use media provenance concepts for images, video, audio, documents, and generated content.

- C2PA Technical Specification: https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html — Use manifest concepts for content provenance where formal media credentials matter.

- Bynder DAM Taxonomy Best Practices: https://www.bynder.com/en/blog/dam-taxonomy-best-practices/ — Taxonomy should be governed, dynamic, and business-context aware rather than folder-only.

- Brandlife Digital Asset Management Checklist for 2026: https://www.brandlife.io/blog/digital-asset-management-checklist — Start with complete asset inventory before platform evaluation; plan governance early.
