# FlashFusion CoWork Automation Catalog v1.0

> **Purpose:** Master blueprint for 100 individually packaged Co-Work skill automations  
> **Phase:** Phase 2 — Each entry becomes a standalone skill zip  
> **Format:** Each skill follows Anthropic 2025 standards (SKILL.md + optional reference files)  
> **Author:** Kyle Rosebrook | FlashFusion  
> **Date:** February 2026

---

## Catalog Structure

Each automation entry includes:
- **ID**: Unique identifier (FF-###)
- **Skill Name**: lowercase-with-hyphens (maps to zip folder name)
- **Category**: Functional grouping
- **Description**: What it does + when to use it
- **Complexity**: Simple (SKILL.md only) | Medium (+ references/) | Advanced (+ workflows/ + scripts/)
- **Audience**: Internal, Clients, or Both

---

## Category Overview

| # | Category | Count | Description |
|---|----------|-------|-------------|
| 1 | Document Generation | 15 | Create branded reports, guides, SOPs, and docs |
| 2 | Data Processing & Analysis | 12 | Extract, transform, analyze, and visualize data |
| 3 | Project Management | 10 | Status reports, sprint summaries, roadmaps |
| 4 | Communication & Writing | 10 | Emails, proposals, internal comms, editing |
| 5 | DevOps & Engineering | 12 | CI/CD docs, incident reports, architecture |
| 6 | Security & Compliance | 8 | Audits, policies, risk assessments |
| 7 | Client Services | 10 | Proposals, onboarding, deliverables |
| 8 | Research & Intelligence | 8 | Competitive analysis, market research, synthesis |
| 9 | File Organization & Automation | 8 | Batch operations, folder management, conversion |
| 10 | Onboarding & Training | 7 | New hire docs, training materials, assessments |
| **Total** | | **100** | |

---

## 1. Document Generation (15)

### FF-001: ff-reference-guide-generator
- **Description**: Generate FlashFusion-branded reference guides with Instrument Serif headings, Geist body, FF color palette (#A855F7 violet, #EC4899 magenta, #22D3EE cyan, #0B0B14 base). Use when creating comprehensive how-to guides for any system, tool, or process.
- **Complexity**: Advanced (SKILL.md + templates/ + references/)
- **Audience**: Both

### FF-002: ff-sop-creator
- **Description**: Create Standard Operating Procedures with roles, approvals, step-by-step procedures, and decision gates. Use for operational procedures requiring accountability chains.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-003: ff-runbook-builder
- **Description**: Build incident response runbooks with severity classification, escalation paths, decision trees, and post-incident review templates. Use for operational and incident playbooks.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-004: ff-kb-article-writer
- **Description**: Write focused Knowledge Base articles answering specific questions or solving specific problems. Follows FF formatting standards with info/warning/best-practice callout boxes.
- **Complexity**: Medium
- **Audience**: Both

### FF-005: meeting-notes-to-doc
- **Description**: Transform raw meeting notes, bullet points, or voice transcriptions into structured meeting minutes with action items, owners, deadlines, and follow-up tracking. Use after any meeting.
- **Complexity**: Medium
- **Audience**: Internal

### FF-006: quarterly-business-review
- **Description**: Generate quarterly business review documents from raw data files, notes, and metrics. Produces formatted .docx with executive summary, KPI dashboards, trend analysis, and recommendations.
- **Complexity**: Advanced
- **Audience**: Both

### FF-007: changelog-generator
- **Description**: Compile changelogs from Git commit history, PR descriptions, or release notes. Outputs formatted markdown or .docx grouped by feature, fix, and breaking change.
- **Complexity**: Medium
- **Audience**: Internal

### FF-008: policy-document-drafter
- **Description**: Draft internal policy documents with standard sections (purpose, scope, definitions, policy statements, enforcement, exceptions). Use for creating or updating company policies.
- **Complexity**: Medium
- **Audience**: Internal

### FF-009: technical-specification-writer
- **Description**: Write technical specification documents from requirements, architecture notes, or whiteboard sessions. Includes system boundaries, data flows, API contracts, and acceptance criteria.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-010: executive-summary-distiller
- **Description**: Distill long documents, reports, or research into concise executive summaries (1-2 pages) with key findings, recommendations, and next steps. Use for leadership communications.
- **Complexity**: Simple
- **Audience**: Both

### FF-011: rfc-template-generator
- **Description**: Generate Request for Comments documents with problem statement, proposed solution, alternatives considered, migration plan, and risk assessment sections.
- **Complexity**: Medium
- **Audience**: Internal

### FF-012: process-flow-documenter
- **Description**: Document end-to-end process flows from descriptions or observations. Outputs formatted docs with swim lane logic, handoff points, SLAs, and exception handling.
- **Complexity**: Medium
- **Audience**: Both

### FF-013: decision-log-tracker
- **Description**: Create and maintain decision log documents tracking key decisions, rationale, participants, date, and status. Appends new decisions to existing logs.
- **Complexity**: Simple
- **Audience**: Internal

### FF-014: release-notes-formatter
- **Description**: Format release notes from raw inputs (Jira tickets, GitHub PRs, Slack threads) into polished customer-facing or internal release announcements.
- **Complexity**: Medium
- **Audience**: Both

### FF-015: contract-summary-extractor
- **Description**: Extract key terms, dates, obligations, and renewal conditions from contract PDFs into a structured summary document. Flags unusual clauses for review.
- **Complexity**: Medium
- **Audience**: Both

---

## 2. Data Processing & Analysis (12)

### FF-016: csv-to-excel-transformer
- **Description**: Convert CSV/TSV files into formatted Excel spreadsheets with headers, auto-widths, conditional formatting, and summary formulas. Use when raw data needs to be presentable.
- **Complexity**: Medium
- **Audience**: Both

### FF-017: multi-file-data-merger
- **Description**: Merge data from multiple CSV, Excel, or JSON files into a single consolidated dataset. Handles column mapping, deduplication, and conflict resolution.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-018: screenshot-to-spreadsheet
- **Description**: Extract structured data from screenshots of tables, receipts, invoices, or forms into Excel spreadsheets. Uses OCR-style analysis of image content.
- **Complexity**: Medium
- **Audience**: Both

### FF-019: expense-report-builder
- **Description**: Build expense reports from receipt images, bank statements, or raw expense lists. Categorizes spending, calculates totals, and produces formatted spreadsheets.
- **Complexity**: Medium
- **Audience**: Internal

### FF-020: data-quality-auditor
- **Description**: Audit CSV/Excel datasets for quality issues: missing values, duplicates, format inconsistencies, outliers, and type mismatches. Produces a data quality report.
- **Complexity**: Medium
- **Audience**: Internal

### FF-021: survey-response-analyzer
- **Description**: Analyze survey response data (CSV/Excel) to produce summary statistics, sentiment analysis, thematic grouping, and visualization-ready charts.
- **Complexity**: Advanced
- **Audience**: Both

### FF-022: log-file-analyzer
- **Description**: Parse and analyze log files (application, server, access) to identify patterns, errors, frequency distributions, and anomalies. Produces structured report.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-023: json-to-excel-converter
- **Description**: Flatten nested JSON data structures into tabular Excel format with proper column headers and data type formatting.
- **Complexity**: Simple
- **Audience**: Internal

### FF-024: pivot-table-generator
- **Description**: Generate Excel pivot tables from raw data files. Accepts column specifications for rows, columns, values, and filters. Produces formatted summary views.
- **Complexity**: Medium
- **Audience**: Both

### FF-025: time-series-forecaster
- **Description**: Analyze time-series data (revenue, traffic, usage) and produce trend analysis with basic forecasting, seasonal decomposition, and growth rate calculations.
- **Complexity**: Advanced
- **Audience**: Both

### FF-026: pdf-table-extractor
- **Description**: Extract tables from PDF documents into structured Excel spreadsheets. Handles multi-page tables, merged cells, and varying formats.
- **Complexity**: Medium
- **Audience**: Both

### FF-027: data-dictionary-builder
- **Description**: Generate data dictionaries from database schemas, CSV headers, or API responses. Documents field names, types, descriptions, constraints, and relationships.
- **Complexity**: Medium
- **Audience**: Internal

---

## 3. Project Management (10)

### FF-028: sprint-summary-generator
- **Description**: Generate sprint summary reports from Jira/Linear exports or task lists. Includes velocity metrics, completed items, carry-over, blockers, and retrospective themes.
- **Complexity**: Medium
- **Audience**: Internal

### FF-029: project-status-reporter
- **Description**: Create weekly/monthly project status reports from scattered notes, task updates, and metrics. RAG status, milestones, risks, and next steps.
- **Complexity**: Medium
- **Audience**: Both

### FF-030: roadmap-visualizer
- **Description**: Transform roadmap data (milestones, dates, dependencies) into formatted timeline documents or presentation slides with visual swimlanes.
- **Complexity**: Advanced
- **Audience**: Both

### FF-031: risk-register-maintainer
- **Description**: Create and update project risk registers with likelihood, impact, mitigation strategies, owners, and status tracking.
- **Complexity**: Medium
- **Audience**: Internal

### FF-032: stakeholder-update-drafter
- **Description**: Draft stakeholder update communications from project data. Adjusts tone and detail level for technical vs executive vs client audiences.
- **Complexity**: Simple
- **Audience**: Both

### FF-033: retrospective-summarizer
- **Description**: Summarize retrospective notes (what went well, what didn't, action items) into structured documents with trends over multiple sprints.
- **Complexity**: Simple
- **Audience**: Internal

### FF-034: gantt-data-generator
- **Description**: Generate Gantt chart data from task lists with dependencies, durations, and assignments. Outputs Excel or CSV ready for import into project tools.
- **Complexity**: Medium
- **Audience**: Internal

### FF-035: resource-allocation-tracker
- **Description**: Create resource allocation spreadsheets showing team member assignments, capacity, utilization rates, and over/under-allocation warnings.
- **Complexity**: Medium
- **Audience**: Internal

### FF-036: project-kickoff-packager
- **Description**: Generate complete project kickoff packages: charter, RACI matrix, communication plan, milestone schedule, and risk assessment from initial requirements.
- **Complexity**: Advanced
- **Audience**: Both

### FF-037: dependency-mapper
- **Description**: Map project dependencies from task lists or architecture docs. Identifies critical path, bottlenecks, and circular dependencies. Outputs structured report.
- **Complexity**: Medium
- **Audience**: Internal

---

## 4. Communication & Writing (10)

### FF-038: email-draft-composer
- **Description**: Compose professional emails from bullet points or rough notes. Adjusts tone (formal, casual, urgent) and structure based on recipient and purpose.
- **Complexity**: Simple
- **Audience**: Both

### FF-039: proposal-writer
- **Description**: Write business proposals with executive summary, problem statement, proposed solution, timeline, pricing, and terms. Use for client or internal proposals.
- **Complexity**: Advanced
- **Audience**: Both

### FF-040: newsletter-repurposer
- **Description**: Repurpose long-form content (blog posts, reports, transcripts) into newsletter-ready formats with headlines, summaries, and call-to-action sections.
- **Complexity**: Medium
- **Audience**: Both

### FF-041: content-tone-adjuster
- **Description**: Rewrite existing content to match a target tone (technical, executive, casual, marketing). Preserves meaning while adjusting vocabulary and structure.
- **Complexity**: Simple
- **Audience**: Both

### FF-042: grammar-and-style-editor
- **Description**: Edit documents for grammar, style, clarity, and consistency. Applies FlashFusion writing style preferences and flags passive voice, jargon, and ambiguity.
- **Complexity**: Medium
- **Audience**: Internal

### FF-043: multi-channel-formatter
- **Description**: Take a single piece of content and format it for multiple channels: email, Slack, LinkedIn post, internal wiki, and presentation slide.
- **Complexity**: Medium
- **Audience**: Both

### FF-044: faq-generator
- **Description**: Generate FAQ documents from product docs, support tickets, or feature descriptions. Groups by topic, writes clear answers, and suggests follow-up resources.
- **Complexity**: Medium
- **Audience**: Both

### FF-045: blog-post-drafter
- **Description**: Draft blog posts from outlines, research notes, or topic descriptions. Includes SEO-friendly structure, headers, meta description, and social sharing snippets.
- **Complexity**: Medium
- **Audience**: Both

### FF-046: internal-memo-writer
- **Description**: Write internal memos with proper structure (To, From, Date, Subject, Body) for organizational announcements, policy changes, or updates.
- **Complexity**: Simple
- **Audience**: Internal

### FF-047: presentation-narrative-builder
- **Description**: Transform bullet points and data into a presentation narrative with speaker notes, story arc, transitions, and audience engagement cues.
- **Complexity**: Medium
- **Audience**: Both

---

## 5. DevOps & Engineering (12)

### FF-048: architecture-decision-record
- **Description**: Generate Architecture Decision Records (ADRs) with context, decision, consequences, and alternatives. Follows ADR template standards.
- **Complexity**: Medium
- **Audience**: Internal

### FF-049: incident-report-generator
- **Description**: Create incident reports from raw timelines, Slack threads, and monitoring data. Includes timeline, impact, root cause, and corrective actions.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-050: api-documentation-writer
- **Description**: Generate API documentation from OpenAPI specs, code comments, or endpoint lists. Includes request/response examples, auth, and error codes.
- **Complexity**: Advanced
- **Audience**: Both

### FF-051: ci-cd-pipeline-documenter
- **Description**: Document CI/CD pipelines with stage descriptions, trigger conditions, environment configs, and rollback procedures.
- **Complexity**: Medium
- **Audience**: Internal

### FF-052: database-migration-planner
- **Description**: Plan database migrations from schema diffs or requirements. Outputs migration scripts, rollback plans, validation queries, and testing steps.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-053: code-review-checklist-builder
- **Description**: Generate code review checklists customized to the tech stack, focusing on security, performance, maintainability, and team conventions.
- **Complexity**: Simple
- **Audience**: Internal

### FF-054: environment-setup-guide
- **Description**: Create developer environment setup guides from existing configs (Dockerfiles, package.json, requirements.txt). Step-by-step with troubleshooting.
- **Complexity**: Medium
- **Audience**: Internal

### FF-055: monitoring-dashboard-spec
- **Description**: Specify monitoring dashboards from SLO/SLA requirements. Outputs metric definitions, alert thresholds, query templates, and layout specs.
- **Complexity**: Medium
- **Audience**: Internal

### FF-056: post-mortem-template
- **Description**: Generate post-mortem documents with blameless analysis structure, timeline reconstruction, contributing factors, and prevention measures.
- **Complexity**: Medium
- **Audience**: Internal

### FF-057: dependency-audit-reporter
- **Description**: Analyze project dependencies (npm, pip, etc.) and generate audit reports showing versions, vulnerabilities, license compliance, and update recommendations.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-058: infrastructure-cost-analyzer
- **Description**: Analyze cloud infrastructure costs from billing exports. Produces breakdown by service, trend analysis, optimization recommendations, and budget projections.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-059: readme-generator
- **Description**: Generate comprehensive README files from project codebases. Includes overview, setup, usage, API reference, contributing guidelines, and license.
- **Complexity**: Medium
- **Audience**: Internal

---

## 6. Security & Compliance (8)

### FF-060: security-policy-generator
- **Description**: Generate security policies (acceptable use, data classification, incident response, access control) from requirements and compliance frameworks.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-061: risk-assessment-builder
- **Description**: Build risk assessments with threat identification, likelihood/impact scoring, control effectiveness evaluation, and remediation priorities.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-062: compliance-gap-analyzer
- **Description**: Analyze current controls against compliance frameworks (SOC 2, HIPAA, PCI-DSS, GDPR) and produce gap analysis reports with remediation roadmaps.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-063: access-review-reporter
- **Description**: Generate access review reports from user/role data. Identifies excessive permissions, orphaned accounts, separation of duties violations, and recommendations.
- **Complexity**: Medium
- **Audience**: Internal

### FF-064: vulnerability-report-formatter
- **Description**: Format vulnerability scan outputs (Nessus, Qualys, OWASP ZAP) into executive-friendly reports with severity grouping, trends, and remediation priorities.
- **Complexity**: Medium
- **Audience**: Internal

### FF-065: data-flow-mapper
- **Description**: Map data flows through systems from architecture docs or interviews. Identifies data at rest, in transit, processing points, and compliance boundaries.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-066: security-training-quiz-maker
- **Description**: Generate security awareness training quizzes from policy documents or training materials. Multiple choice, scenario-based, with answer keys and explanations.
- **Complexity**: Medium
- **Audience**: Internal

### FF-067: audit-evidence-packager
- **Description**: Package audit evidence (screenshots, configs, policies, logs) into organized folder structures with index documents mapping evidence to control requirements.
- **Complexity**: Advanced
- **Audience**: Internal

---

## 7. Client Services (10)

### FF-068: client-proposal-generator
- **Description**: Generate customized client proposals for the Customization Service. Includes service overview, product catalog, pricing tiers, timeline, and terms.
- **Complexity**: Advanced
- **Audience**: Both

### FF-069: client-onboarding-packager
- **Description**: Create client onboarding packages with welcome docs, service agreements, access setup guides, communication protocols, and milestone schedules.
- **Complexity**: Advanced
- **Audience**: Both

### FF-070: client-report-builder
- **Description**: Build client-facing reports from internal data. Transforms raw metrics into polished deliverables with executive summaries and visualizations.
- **Complexity**: Advanced
- **Audience**: Both

### FF-071: sow-generator
- **Description**: Generate Statements of Work from project requirements. Includes scope, deliverables, timeline, acceptance criteria, and change management process.
- **Complexity**: Advanced
- **Audience**: Both

### FF-072: pricing-calculator
- **Description**: Calculate pricing for customization service engagements based on product count, complexity tier, volume, and margin targets. Outputs formatted pricing sheets.
- **Complexity**: Medium
- **Audience**: Internal

### FF-073: case-study-writer
- **Description**: Write client case studies from project data and outcomes. Follows problem/solution/result structure with quantified metrics and testimonial hooks.
- **Complexity**: Medium
- **Audience**: Both

### FF-074: client-presentation-builder
- **Description**: Build client presentations from project data, milestones, and deliverables. FF-branded slides with professional layouts and data visualizations.
- **Complexity**: Advanced
- **Audience**: Both

### FF-075: service-catalog-updater
- **Description**: Update the Customization Service product catalog from new product data. Maintains consistent formatting, pricing, and description standards across 45+ products.
- **Complexity**: Medium
- **Audience**: Internal

### FF-076: feedback-analyzer
- **Description**: Analyze client feedback (surveys, emails, call notes) to identify themes, sentiment trends, and actionable insights. Produces structured summary reports.
- **Complexity**: Medium
- **Audience**: Internal

### FF-077: renewal-package-builder
- **Description**: Generate contract renewal packages with performance summaries, value delivered, proposed changes, and updated pricing for existing clients.
- **Complexity**: Medium
- **Audience**: Both

---

## 8. Research & Intelligence (8)

### FF-078: competitive-analysis-reporter
- **Description**: Compile competitive analysis reports from web research, product comparisons, and market data. Structured comparison matrices with strengths/weaknesses.
- **Complexity**: Advanced
- **Audience**: Both

### FF-079: market-research-synthesizer
- **Description**: Synthesize market research from multiple sources (reports, articles, data) into structured analysis with market size, trends, opportunities, and threats.
- **Complexity**: Advanced
- **Audience**: Both

### FF-080: technology-evaluation-matrix
- **Description**: Build technology evaluation matrices comparing platforms/tools across weighted criteria. Produces scored comparison with recommendation justification.
- **Complexity**: Medium
- **Audience**: Internal

### FF-081: vendor-assessment-builder
- **Description**: Create vendor assessment documents evaluating capabilities, pricing, security posture, references, and fit. Weighted scoring with final recommendation.
- **Complexity**: Medium
- **Audience**: Internal

### FF-082: trend-report-compiler
- **Description**: Compile trend reports from news feeds, industry publications, and research papers. Identifies emerging patterns, implications, and strategic recommendations.
- **Complexity**: Medium
- **Audience**: Both

### FF-083: patent-landscape-mapper
- **Description**: Map patent landscapes from search results. Categorizes by technology area, assignee, filing date, and identifies white spaces and cluster patterns.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-084: literature-review-builder
- **Description**: Build structured literature reviews from research papers and articles. Organized by theme with synthesis, gaps identified, and citation management.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-085: swot-analysis-generator
- **Description**: Generate SWOT analysis documents from business data, market research, and strategic inputs. Structured with actionable strategies per quadrant.
- **Complexity**: Simple
- **Audience**: Both

---

## 9. File Organization & Automation (8)

### FF-086: downloads-folder-organizer
- **Description**: Organize messy Downloads folders by reading file content and metadata, then sorting into logical subfolders with intelligent renaming.
- **Complexity**: Medium
- **Audience**: Both

### FF-087: batch-file-renamer
- **Description**: Batch rename files using consistent naming conventions. Supports date-based, sequential, content-based, and regex pattern renaming strategies.
- **Complexity**: Simple
- **Audience**: Both

### FF-088: document-format-converter
- **Description**: Convert documents between formats (Markdown to DOCX, DOCX to PDF, HTML to Markdown, etc.) with formatting preservation and style mapping.
- **Complexity**: Medium
- **Audience**: Both

### FF-089: image-batch-processor
- **Description**: Batch process images: resize, crop, format convert, compress, watermark, or rename. Maintains folder structure and produces processing report.
- **Complexity**: Medium
- **Audience**: Both

### FF-090: archive-structure-builder
- **Description**: Build organized archive folder structures from project files. Creates index documents, README files, and standardized hierarchies for long-term storage.
- **Complexity**: Medium
- **Audience**: Internal

### FF-091: duplicate-file-finder
- **Description**: Scan directories for duplicate files by content hash, filename similarity, or metadata. Produces report with recommendations for which copies to keep.
- **Complexity**: Medium
- **Audience**: Both

### FF-092: folder-template-stamper
- **Description**: Create standardized folder structures from templates (project folders, client folders, sprint folders). Populates with README files and placeholder docs.
- **Complexity**: Simple
- **Audience**: Internal

### FF-093: file-inventory-generator
- **Description**: Generate detailed file inventories for directories: file names, sizes, types, dates, word counts for documents, and summary statistics.
- **Complexity**: Simple
- **Audience**: Both

---

## 10. Onboarding & Training (7)

### FF-094: new-hire-onboarding-kit
- **Description**: Generate personalized onboarding packages for new team members based on role, department, and start date. Includes first-week schedule, reading list, and setup guides.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-095: role-specific-training-plan
- **Description**: Create role-specific training plans with learning objectives, resources, milestones, and assessment criteria. Customized to department and experience level.
- **Complexity**: Medium
- **Audience**: Internal

### FF-096: knowledge-transfer-documenter
- **Description**: Document knowledge transfer sessions with structured Q&A, system walkthroughs, tribal knowledge capture, and gap identification.
- **Complexity**: Medium
- **Audience**: Internal

### FF-097: training-assessment-creator
- **Description**: Create training assessments (quizzes, practical exercises, scenario evaluations) from training materials or documentation.
- **Complexity**: Medium
- **Audience**: Internal

### FF-098: team-handbook-generator
- **Description**: Generate team handbooks covering culture, processes, tools, communication norms, meeting cadence, and escalation procedures.
- **Complexity**: Advanced
- **Audience**: Internal

### FF-099: tool-quickstart-guide
- **Description**: Create quickstart guides for internal tools from documentation or usage patterns. 5-minute setup, key workflows, common gotchas, and support contacts.
- **Complexity**: Simple
- **Audience**: Both

### FF-100: skills-gap-assessor
- **Description**: Assess team skills gaps from self-assessment data or manager input. Produces heatmap-style reports with training recommendations and priority rankings.
- **Complexity**: Medium
- **Audience**: Internal

---

## Phase 2 Packaging Plan

### Batch Schedule

| Batch | Skills | IDs | Session Estimate |
|-------|--------|-----|------------------|
| 1 | Document Generation | FF-001 to FF-015 | 1-2 sessions |
| 2 | Data Processing | FF-016 to FF-027 | 1-2 sessions |
| 3 | Project Management | FF-028 to FF-037 | 1 session |
| 4 | Communication & Writing | FF-038 to FF-047 | 1 session |
| 5 | DevOps & Engineering | FF-048 to FF-059 | 1-2 sessions |
| 6 | Security & Compliance | FF-060 to FF-067 | 1 session |
| 7 | Client Services | FF-068 to FF-077 | 1-2 sessions |
| 8 | Research & Intelligence | FF-078 to FF-085 | 1 session |
| 9 | File Organization | FF-086 to FF-093 | 1 session |
| 10 | Onboarding & Training | FF-094 to FF-100 | 1 session |

**Estimated total: 10-14 sessions**

### Packaging Standards (per skill)

Each skill zip will contain:

```
cw-###-skill-name/
├── SKILL.md              # <500 lines, YAML frontmatter, trigger patterns
├── references/           # Domain knowledge, templates, standards (if needed)
│   └── [reference files]
├── workflows/            # Multi-step procedures (if needed)
│   └── [workflow files]
└── templates/            # Output format templates (if needed)
    └── [template files]
```

### Validation Criteria

- [ ] YAML frontmatter: name (lowercase-hyphens) + description (what + when)
- [ ] SKILL.md under 500 lines
- [ ] No API keys, secrets, or sensitive data
- [ ] Description specifies both WHAT and WHEN
- [ ] Single top-level folder matches skill name
- [ ] Package under 10MB
- [ ] Passes skill-packager validation

### Priority Order

**Highest priority (build first):**
1. FF-001 to FF-004 (FF document templates — immediate daily use)
2. FF-028, FF-029 (Sprint/project reporting — weekly use)
3. FF-049, FF-056 (Incident/post-mortem — critical path)
4. FF-068, FF-069, FF-070 (Client services — revenue generating)
5. FF-060, FF-062 (Security policies — compliance requirement)

**Medium priority:**
6. FF-016 to FF-020 (Data processing — frequent use)
7. FF-038 to FF-042 (Communication — daily use)
8. FF-086 to FF-089 (File organization — productivity)

**Lower priority (build last):**
9. FF-083, FF-084 (Research — occasional use)
10. FF-094 to FF-100 (Onboarding — periodic use)

---

## Notes

- Each skill should be self-contained and composable with other skills
- Skills should follow progressive disclosure: SKILL.md provides core instructions, reference files provide depth
- All skills should work in both Co-Work (file access) and standard Claude chat (limited functionality)
- FF-branded skills (FF-001 to FF-004) must reference FF brand constants: Geist, Instrument Serif, #A855F7, #EC4899, #22D3EE, #0B0B14
- Security-related skills (FF-060 to FF-067) must include compliance framework mappings
- Client-facing skills must exclude internal-only information and processes
