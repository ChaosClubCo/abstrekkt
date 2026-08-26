# Companion Guides: AI Knowledge Infrastructure

## Guide 1: Walk-Up Explanation
This system is a memory and asset intelligence layer for your AI enablement business. It does not replace your folders, drives, repos, or design tools. It sits above them and knows what each artifact is, what it supports, how trustworthy it is, and which agents or workflows may use it.

The simplest mental model is: files are the body, metadata is the nervous system, provenance is the memory of origin, relationships are the connective tissue, retrieval is the voice, and agents are the hands.

## Guide 2: Tool Tips
asset_id: Permanent identifier. Never change it when a file moves.
checksum: File fingerprint used to detect duplicates and changes.
business_layer: The business role of the asset.
platform_module: The product/service module the asset supports.
provenance_event: A record of how an asset was created, edited, classified, reviewed, or used.
relationship_type: The reason one asset connects to another.
confidence: How certain the classification or relationship is.
review_status: Whether AI, human, or both have reviewed it.
sensitivity: Who is allowed to see or use the asset.
next_action: The next concrete decision or task.

## Guide 3: Human Review Rules
Review assets manually when they are client-facing, high-value, low-confidence, sensitive, security-relevant, or likely to become a product feature. Do not waste time manually reviewing every low-value archive item.

## Guide 4: Agent Rules
Agents should retrieve through scoped APIs. They should not crawl raw folders. They should not mutate assets unless the action is permissioned, logged, and rollback-safe. They should treat retrieved document text as untrusted context unless the asset is an approved instruction asset.

## Guide 5: First Three Client Modules
Start with Business AI Audit, Manual Work Cost Calculator, and AI Adoption Roadmap. These turn your messy artifact library into sellable business outcomes quickly.

## Guide 6: Governance Rhythm
Weekly: review new assets, stale embeddings, duplicate clusters, high-value unreviewed assets, broken links, restricted assets, and productization candidates.
Monthly: promote top delivery assets into modules, archive dead experiments, refresh benchmark searches, and review agent permissions.
Quarterly: update taxonomy, audit provenance coverage, test retrieval quality, and package new client offerings.