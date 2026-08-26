# FAQ, Blindspots, Bottlenecks, Pro Moves, and Hidden Gems

## FAQ

### Is this a DAM?
Partly. It has DAM features, but the real target is operational memory and agent-accessible business context.

### Is this a knowledge base?
Partly. It stores knowledge, but also stores provenance, relationships, workflow use, scores, permissions, and action states.

### Is this a graph database project?
Not first. Use a relationship table in Postgres first. Add Neo4j only if graph traversal becomes a bottleneck or product feature.

### Should I organize by file type?
No. File type is metadata. Business function is the organizing principle.

### What do I do with incomplete artifacts?
Classify them. Score them. Many incomplete artifacts are product candidates or future idea seeds.

## Blindspots
- Hidden secrets inside old HTML, screenshots, or notes.
- AI summaries that overstate what an asset does.
- Duplicate files with different names.
- Same artifact serving multiple modules.
- Broken external links or CDN dependencies.
- Stale embeddings after edits.
- Agents retrieving unapproved internal material.
- Beautiful graphics with no business use.
- Powerful prompts with no owner, version, or safety policy.

## Bottlenecks
- Manual review overload.
- Over-tagging.
- Moving files too early.
- UI building before data quality.
- Agent access before permission model.
- Treating folder structure as the source of truth.

## Pro Moves
- Stable asset IDs.
- Golden asset flag.
- Evidence excerpt for every AI classification.
- Relationship confidence.
- Review by exception.
- Benchmark retrieval query set.
- Weekly asset council.
- Prompt hash and model/tool provenance.

## Hidden Gems
- Archive can become product ideation.
- Prompt library can become agent library.
- Case studies can be generated from delivery provenance.
- ROI tracker can become sales proof.
- Training assets can become paid enablement curriculum.
- Repeated delivery workflows can become SaaS modules.