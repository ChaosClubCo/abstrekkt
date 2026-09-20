You are performing a professional-grade extraction and export of the available PROJECT.

Your job is to actively extract, organize, validate, and package every real reusable artifact from the project material that is actually accessible in the current environment.

Do not stop early just because the strongest possible source is unavailable. Use the strongest available source, then continue extraction from all lesser available sources. If a source is missing, record the limitation and keep going with what is available.

The current chat is not the primary source of truth. Use it only for instructions, configuration, approvals, and any explicit project artifact content that is visibly present in the conversation.

============================================================
OPERATING MODE
============================================================

Run in EXTRACTION-FIRST MODE.

This means:

1. Do not ask for a repository archive before starting.
2. Do not block Phase 0 because an archive/export is missing.
3. Do not stop after source discovery unless absolutely no usable source material exists.
4. Prefer stronger sources when available, but extract from all accessible sources.
5. If a source type is unavailable, document it as unavailable and continue.
6. If content is partial, export it as PARTIAL.
7. If an expected item is referenced but not found, mark it MISSING.
8. Do not invent, infer, reconstruct, summarize, or fabricate missing project content.
9. Preserve source wording, formatting, code, tables, diagrams, prompts, schemas, and notes exactly where available.
10. Build the final export package after extraction and validation.

============================================================
CONFIGURATION
============================================================

Infer these values from available project material when possible:

PROJECT_NAME:
<Human-readable project name>

EXPORT_SLUG:
<lowercase-kebab-case-name>

ROOT_EXPORT_DIRECTORY:
./<EXPORT_SLUG>/

OUTPUT_ZIP:
<EXPORT_SLUG>_export.zip

EXPORT_SCOPE:
<repository | workspace | uploaded files | official export | connected documents | visible project artifacts | mixed source set>

If values are not safely inferable, use:

PROJECT_NAME: Project Export
EXPORT_SLUG: project-export
ROOT_EXPORT_DIRECTORY: ./project-export/
OUTPUT_ZIP: project-export_export.zip
EXPORT_SCOPE: mixed source set

============================================================
SOURCE PRIORITY
============================================================

Use all accessible project sources, in this priority order:

1. Official project export files, archives, raw dumps, or platform exports
2. Repository archives:
   - .zip
   - .tar
   - .tar.gz
   - .tgz
3. Extracted repository folders
4. Workspace/project folders
5. Connected repository sources
6. Connected-source project documents
7. Uploaded individual project files
8. Attachments containing project artifacts
9. Visible conversation content containing explicit project artifacts

A stronger source does not exclude weaker sources. If multiple sources exist, extract from all of them, deduplicate by source path, title, checksum, and content identity.

Do not treat ordinary chat messages, assistant commentary, planning chatter, confirmations, or meta-discussion as project artifacts unless they contain reusable project content such as:

- specs
- requirements
- prompts
- architecture notes
- code
- schemas
- implementation plans
- security notes
- roadmaps
- decisions
- UX flows
- operational procedures
- deployment notes
- automation definitions

============================================================
PRIMARY OBJECTIVE
============================================================

Create a complete, validated export package containing every real reusable artifact found in the available project source material.

Artifacts may include, but are not limited to:

- Specifications
- Requirements
- Architecture notes
- System designs
- Code
- Scripts
- Configuration examples
- Environment templates
- Data models
- Database schemas
- API contracts
- Agent instructions
- Prompts
- UX flows
- Wireframe descriptions
- Diagrams
- Tables
- Matrices
- Roadmaps
- Strategies
- Research notes
- Legal or intake notes
- Brand/naming work
- Operations plans
- Meeting notes
- Decision records
- Partial drafts
- Superseded drafts
- Deprecated files
- Archived versions
- README-style material
- Implementation plans
- Security reviews
- Test plans
- Migration plans
- Deployment notes
- CI/CD notes
- Automation definitions
- Monitoring or observability plans
- Integration notes
- Connector or MCP configuration

============================================================
NON-NEGOTIABLE RULES
============================================================

1. Export only content that exists in accessible project source material.
2. Do not invent content.
3. Do not reconstruct missing artifacts from memory.
4. Do not create placeholder files.
5. Do not create stub files.
6. Do not create files containing only a title, category label, heading, or one-sentence description.
7. Do not summarize an artifact unless the artifact itself was originally a summary.
8. Do not silently omit partial drafts, superseded versions, unfinished artifacts, deprecated files, or archived versions.
9. Preserve original code, markdown, tables, diagrams, prompts, technical notes, structure, wording, and formatting where available.
10. If full content is missing, write exactly:
    MISSING: <item name> — not found in accessible project source material.
11. Every exported artifact must trace back to actual accessible source material.
12. Do not claim access to files, repositories, workspaces, connected documents, official exports, or project context that are not actually available.
13. Do not treat hidden memory, prior conversations, unavailable workspace state, or inferred project history as source material.
14. Do not export ordinary conversational filler unless it contains explicit reusable project artifact content.
15. Do not provide the final download link until validation has completed successfully.
16. Do not stop between phases for approval unless the user explicitly requested staged approval.
17. Continue through all phases autonomously when sufficient source material exists.

============================================================
PHASE 0 — PROJECT SOURCE DISCOVERY
============================================================

Actively inspect the environment for accessible project source material.

Check for:

- Official export files
- Repository archives
- Extracted repository folders
- Workspace/project folders
- Uploaded files
- Connected repository sources
- Connected Drive/SharePoint/Notion/GitHub source material
- Attachments
- Markdown bundles
- JSON exports
- HTML exports
- Document dumps
- Explicit project artifacts visible in the conversation

If an archive is found, extract it into a controlled working directory.

Archive handling rules:

1. Treat archive contents as source material.
2. Do not write export files inside the extracted source directory.
3. Preserve original source paths in the manifest.
4. Inventory real files and artifacts from the extracted source.
5. Exclude generated dependency directories unless they contain explicit project-authored artifacts.

Default exclusions:

- node_modules/
- .next/
- dist/
- build/
- coverage/
- .turbo/
- .cache/
- vendor/
- __pycache__/
- .pytest_cache/
- .venv/
- venv/
- target/
- bin/
- obj/
- .git/objects/
- large binary assets unless explicitly project-relevant

Do not exclude:

- README files
- docs/
- specs/
- architecture/
- prompts/
- agents/
- scripts/
- config examples
- schema files
- migrations
- CI/CD files
- deployment files
- infrastructure files
- package manifests
- lockfiles
- source code
- tests
- workflow definitions
- automation/routine definitions
- markdown notes
- project-authored JSON/YAML/TOML files

Output:

PROJECT SOURCE DISCOVERY

- Project name: <PROJECT_NAME>
- Export slug: <EXPORT_SLUG>
- Root export directory: <ROOT_EXPORT_DIRECTORY>
- Output zip: <OUTPUT_ZIP>
- Export scope: <EXPORT_SCOPE>
- Strongest source found: <official export | repository archive | extracted repository | workspace folder | connected source | uploaded files | visible project artifacts | none>
- Official project export files: <list or none>
- Repository archives: <list or none>
- Extracted source directories: <list or none>
- Repository/workspace folders: <list or none>
- Uploaded project files: <list or none>
- Connected-source documents: <list or none>
- Attachments: <list or none>
- Visible conversation project artifacts: <available / limited / unavailable>
- Known limitations: <specific limitations>
- Extraction will proceed: <yes/no>
- Reason: <why extraction can or cannot proceed>

If no usable source material exists, stop and output:

EXPORT FAILED — NO ACCESSIBLE PROJECT SOURCE MATERIAL

Then list exactly what was checked and what was unavailable.

If any usable source material exists, proceed immediately to Phase 1.

============================================================
PHASE 1 — COMPLETE PROJECT ARTIFACT INVENTORY
============================================================

Create a complete inventory of every project artifact, deliverable, document, spec, diagram, code block, table, architecture, roadmap, prompt, strategy, plan, matrix, data model, configuration, script, partial draft, or reusable output found in the accessible project source material.

Include:

- Final artifacts
- Partial drafts
- Superseded versions
- Deprecated files
- Archived versions
- Code snippets
- Source files
- Configuration files
- Architecture notes
- Security notes
- UX flows
- Agent instructions
- Brand or naming work
- Roadmaps
- Tables and matrices
- Prompts
- README-style material
- Operational plans
- Research summaries
- Implementation plans
- Legal/intake notes, if present
- Decision records
- Meeting notes
- Any reusable generated output
- Any project-specific automation, routine, workflow, connector, MCP, CI/CD, deployment, or infrastructure content

Exclude:

- Ordinary conversational filler
- Repeated confirmations
- Low-value acknowledgments
- Meta-discussion unless it contains reusable project artifact content
- Assistant commentary that does not itself contain a reusable artifact
- Inferred or reconstructed content not present in project source material
- Generated dependency/build/cache output unless explicitly project-authored

For each item, include:

- Inventory number
- Artifact title
- One-sentence description of what it actually contains
- Source location or source evidence
- Content type
- Confidence level: HIGH, MEDIUM, or LOW
- Status: AVAILABLE, PARTIAL, or MISSING
- Extraction target path

Use this format:

[1] <Artifact Title> — <one-sentence description> — Type: <content type> — Source: <source reference> — Target: ./<EXPORT_SLUG>/<path> — Status: <AVAILABLE/PARTIAL/MISSING> — Confidence: <HIGH/MEDIUM/LOW>
[2] <Artifact Title> — <one-sentence description> — Type: <content type> — Source: <source reference> — Target: ./<EXPORT_SLUG>/<path> — Status: <AVAILABLE/PARTIAL/MISSING> — Confidence: <HIGH/MEDIUM/LOW>

After inventory, proceed immediately to Phase 2.

============================================================
PHASE 2 — FULL PROJECT CONTENT EXTRACTION
============================================================

For every inventory item, extract the complete artifact content.

Rules:

1. Extract artifacts sequentially by inventory number.
2. Do not summarize, compress, paraphrase, or omit details.
3. If the artifact is code, preserve the complete code.
4. If the artifact is a table, preserve the complete table.
5. If the artifact is a diagram, preserve the original Mermaid, ASCII, markdown, diagram syntax, or source description exactly as available.
6. If the artifact is a spec, preserve every section and subsection.
7. If the artifact is a prompt, preserve the full prompt.
8. If the artifact is a roadmap, preserve the full roadmap.
9. If the artifact is a strategy, preserve the full strategy.
10. If the artifact is legal/intake/source material, preserve raw factual wording and uncertainty markers.
11. If content is long, keep it intact in the exported file. Do not truncate it.
12. If full content is unavailable, export:
    MISSING: <item name> — not found in accessible project source material.

For each extracted item, track:

- Inventory ID
- Source reference
- Target file path
- Content type
- Status
- Confidence
- Extraction notes
- Whether the content is complete or partial

After extraction, proceed immediately to Phase 3.

============================================================
PHASE 3 — FILE STRUCTURE AND MANIFEST PLAN
============================================================

Create a logical project export structure under:

./<EXPORT_SLUG>/

Use only folders that fit the actual extracted content.

Allowed top-level folders include:

architecture/
specs/
agents/
brand/
roadmaps/
code/
ux/
security/
prompts/
data/
docs/
research/
operations/
legal/
meetings/
decisions/
archive/
config/
scripts/
schemas/
api/
deployment/
ci-cd/
integrations/
automations/
missing/

Also create these root files:

README.md
MANIFEST.json
CHECKSUMS.sha256
VALIDATION_REPORT.md

README.md must include:

- Export title
- Export date
- Export scope
- Project source material used
- Known limitations
- Table of contents
- File descriptions
- Missing-content notes
- Partial-content notes
- Validation summary

MANIFEST.json must include one object per exported artifact:

{
  "id": "<inventory number>",
  "title": "<artifact title>",
  "path": "<target file path>",
  "source": "<source reference>",
  "content_type": "<content type>",
  "status": "OK | PARTIAL | MISSING",
  "confidence": "HIGH | MEDIUM | LOW",
  "notes": "<short note if needed>"
}

CHECKSUMS.sha256 must contain SHA-256 checksums for every exported file.

VALIDATION_REPORT.md must include:

- File path
- Byte size
- SHA-256 hash
- Status: OK, REWRITTEN, PARTIAL, or MISSING
- Any validation warnings

Use lowercase kebab-case filenames.

Show:

1. Final directory tree
2. Mapping from inventory item to file path
3. Planned manifest records

Then proceed immediately to Phase 4.

============================================================
PHASE 4 — PACKAGE WITH PYTHON OR LOCAL FILE TOOLING
============================================================

Use Python/code interpreter or available local file-generation tooling to create the final project export package.

The packaging script must:

1. Create ./<EXPORT_SLUG>/.
2. Create all required subdirectories.
3. Write every extracted project artifact to its mapped file.
4. Write README.md.
5. Write MANIFEST.json.
6. Open every written file after creation.
7. Compute byte size for every file.
8. Compute SHA-256 hash for every file.
9. Reject any non-MISSING file under 100 bytes.
10. Reject any file that contains only a title, heading, category label, placeholder, or one-sentence stub.
11. Rewrite rejected files only if full extracted source content is available.
12. If source content is unavailable, move the item to missing/ and mark it MISSING.
13. Write CHECKSUMS.sha256.
14. Write VALIDATION_REPORT.md.
15. Create <EXPORT_SLUG>_export.zip from ./<EXPORT_SLUG>/.
16. Verify that the zip exists.
17. Compute the zip byte size.
18. Print the final validated file list with byte sizes and hashes.
19. Print the final zip size.
20. Provide the download link only after validation succeeds.

Required validation output format:

VALIDATION OUTPUT

<file path> | <bytes> bytes | <sha256> | <OK/REWRITTEN/PARTIAL/MISSING>

ZIP OUTPUT

<EXPORT_SLUG>_export.zip | <bytes> bytes | OK

Hard validation rules:

- No empty files.
- No placeholder-only files.
- No non-MISSING file under 100 bytes.
- No files outside ./<EXPORT_SLUG>/.
- No invented content.
- UTF-8 only.
- Preserve markdown, code, table, and diagram formatting.
- Do not zip until validation passes.
- Do not silently skip failed files.
- Do not include ordinary chat transcript content unless it is an explicit project artifact.
- Do not include unavailable project materials as if they were accessible.

If validation fails, fix the export if source content exists. If it cannot be fixed without inventing content, mark the affected item MISSING or PARTIAL and rerun validation.

Proceed to Phase 5 only after validation succeeds.

============================================================
PHASE 5 — FINAL REPORT
============================================================

After packaging, provide:

1. Project source discovery summary
2. Final inventory count
3. Final validated file list with sizes
4. SHA-256 checksum summary
5. Missing-content warnings
6. Partial-content warnings
7. Project source coverage summary
8. Validation summary
9. Download link to <EXPORT_SLUG>_export.zip

Do not provide the download link before showing validation output.

============================================================
FAILURE CONDITIONS
============================================================

The export fails if:

1. Usable source material exists but extraction does not proceed.
2. Any artifact is listed but not extracted or marked MISSING.
3. Any artifact is summarized instead of fully extracted.
4. Any file contains only a title, heading, stub, placeholder, or one sentence.
5. Any non-MISSING file under 100 bytes is included.
6. The final zip is offered without validation output.
7. Any content is invented.
8. Any code block is truncated.
9. Any table is partially omitted.
10. Source limitations are hidden or softened.
11. The exporter claims access to files, chats, repositories, workspaces, connected documents, official exports, or project context that are not actually available.
12. The export directory or zip filename is hardcoded to the wrong project.
13. Ordinary conversation is exported as project content without containing explicit reusable project artifact material.
14. The exporter stops to request a stronger source even though lesser accessible source material exists.
15. The exporter asks for approval between phases even though the user requested extraction-first operation.

============================================================
BEGIN NOW
============================================================

Start by discovering accessible project source material, then continue through inventory, extraction, file creation, validation, packaging, and final reporting without waiting for approval between phases unless no usable source material exists.
