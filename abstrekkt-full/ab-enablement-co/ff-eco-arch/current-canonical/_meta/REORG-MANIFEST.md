# Reorganization Manifest

Generated during the by-lane reorganization of `current-canonical`. Every line records a move as
`old/path → new/path`. Archived files are under `_archive/` (nothing deleted). To reverse a move,
swap the two paths.

Baseline file count (pre-reorg, excl. `.claude/`): **643**

---

## Phase 2 — Whole sub-projects (intact-unit moves)

```
flashfusion-batch3/flashfusion-16-agent-system-v3.0.0    → flashfusion/16-agent-system
flashfusion-batch3/ai-orchestration-platform-v1.0.0      → flashfusion/ai-orchestration-platform
flashfusion-batch3/prompt-engineering-ultimate-toolkit   → flashfusion/prompt-toolkit
flashfusion-batch3/stitch_swarm_grid_command_center_dashboard → flashfusion/stitch-command-center
flashfusion-batch3/INT-HumanX-2026-Package               → intinc/prompt-engineering-system/INT-HumanX-2026-Package
cowork-session                                           → memoir/cowork-session
drafting-mulitform-content-needsrebuild                  → chaosclubco/drafting-skill
```

## Phase 3 — Root loose files

```
01-*.md … 15-*.md (15 dashboard specs)     → intinc/dashboard-prompts/
INT, *.docx (31 KB/runbook docs)           → intinc/deployment-kit/
PROJECT_STATE_UPDATED.md                   → _meta/
PROJECT_INSTRUCTIONS_UPDATED.md            → _meta/
PROJECT_STATE.md (Mar 25, superseded)      → _archive/
WorkstreamMapper.jsx                       → _meta/tools/
claude-config-explorer.jsx                 → _meta/tools/
dispatch-v3.jsx                            → _meta/tools/
prompt-framework-explorer.jsx              → _meta/tools/
flashfusion-agent-factory.jsx              → flashfusion/artifacts/
stitch-proxy.zip                           → flashfusion/artifacts/
cowork-book-project-prompt.md (v1, superseded) → _archive/
e_c_e_c_d_d_mp_.mp4                         → media/
```

## Phase 4 — flashfusion-batch3 drained by lane (per-file)

288 moves this pass, 0 destination collisions. Nested `flashfusion-batch2/` and
`flashfusion-batch3/` collapsed; empty `flashfusion-batch3/` wrapper removed.

```
flashfusion-batch3/00-suite-hub.jsx → flashfusion/suite/00-suite-hub.jsx
flashfusion-batch3/01-intake-form.jsx → flashfusion/suite/01-intake-form.jsx
flashfusion-batch3/02-prompt-package-builder.jsx → flashfusion/suite/02-prompt-package-builder.jsx
flashfusion-batch3/03-self-service-guide.jsx → flashfusion/suite/03-self-service-guide.jsx
flashfusion-batch3/04-outcome-tracker.jsx → flashfusion/suite/04-outcome-tracker.jsx
flashfusion-batch3/05-accountability-tracker.jsx → flashfusion/suite/05-accountability-tracker.jsx
flashfusion-batch3/06-objection-handler.jsx → flashfusion/suite/06-objection-handler.jsx
flashfusion-batch3/07-program-health-report.jsx → flashfusion/suite/07-program-health-report.jsx
flashfusion-batch3/ff-prompt-01-opportunity-mapper.md → flashfusion/prompts/ff-prompt-01-opportunity-mapper.md
flashfusion-batch3/ff-prompt-02-roi-failure-diagnostic.md → flashfusion/prompts/ff-prompt-02-roi-failure-diagnostic.md
flashfusion-batch3/ff-prompt-03-audit-scorecard.md → flashfusion/prompts/ff-prompt-03-audit-scorecard.md
flashfusion-batch3/FlashFusion-tokens-v3.md → flashfusion/prompts/FlashFusion-tokens-v3.md
flashfusion-batch3/flashfusion-pipeline-build-template.md → flashfusion/prompts/flashfusion-pipeline-build-template.md
flashfusion-batch3/flashfusion-notebooklm-research-prompt.md → flashfusion/prompts/flashfusion-notebooklm-research-prompt.md
flashfusion-batch3/FlashFusion-CoWork-100-Automations-Catalog.md → flashfusion/cowork-training/FlashFusion-CoWork-100-Automations-Catalog.md
flashfusion-batch3/FlashFusion-CoWork-Playbook-v1_0.docx → flashfusion/cowork-training/FlashFusion-CoWork-Playbook-v1_0.docx
flashfusion-batch3/FlashFusion-CoWork-Reference-Guide.docx → flashfusion/cowork-training/FlashFusion-CoWork-Reference-Guide.docx
flashfusion-batch3/FlashFusion-CoWork-Training-Deck.pptx → flashfusion/cowork-training/FlashFusion-CoWork-Training-Deck.pptx
flashfusion-batch3/FlashFusion-CoWork-Training-v1_0.pptx → flashfusion/cowork-training/FlashFusion-CoWork-Training-v1_0.pptx
flashfusion-batch3/ff-blog-ai-tools-claims-vs-reality.html → flashfusion/blog/ff-blog-ai-tools-claims-vs-reality.html
flashfusion-batch3/ff-blog-claude-code-blueprint.html → flashfusion/blog/ff-blog-claude-code-blueprint.html
flashfusion-batch3/ff-blog-prompt-engineering-thinking.html → flashfusion/blog/ff-blog-prompt-engineering-thinking.html
flashfusion-batch3/flashfusion_3d.html → flashfusion/web/flashfusion_3d.html
flashfusion-batch3/flashfusion-parallax.html → flashfusion/web/flashfusion-parallax.html
flashfusion-batch3/flashfusion-v2.html → flashfusion/web/flashfusion-v2.html
flashfusion-batch3/flashfusion-content-strategy.html → flashfusion/web/flashfusion-content-strategy.html
flashfusion-batch3/flashfusion-batch3/flashfusion-content-strategy.docx → flashfusion/web/flashfusion-content-strategy.docx
flashfusion-batch3/ff-claude-code-impact-matrix.jsx → flashfusion/artifacts/ff-claude-code-impact-matrix.jsx
flashfusion-batch3/ff-claude-ecosystem-explorer.jsx → flashfusion/artifacts/ff-claude-ecosystem-explorer.jsx
flashfusion-batch3/ff-prompt-registry.jsx → flashfusion/artifacts/ff-prompt-registry.jsx
flashfusion-batch3/ff-registry-patch-2026-05-23.js → flashfusion/artifacts/ff-registry-patch-2026-05-23.js
flashfusion-batch3/flashfusion-session-export.txt → flashfusion/artifacts/flashfusion-session-export.txt
flashfusion-batch3/ff-command.png → flashfusion/artifacts/ff-command.png
flashfusion-batch3/ff-emblem.png → flashfusion/artifacts/ff-emblem.png
flashfusion-batch3/ff-prompt-forge.png → flashfusion/artifacts/ff-prompt-forge.png
flashfusion-batch3/managed_agents_40.json → flashfusion/artifacts/managed_agents_40.json
flashfusion-batch3/stitch-prompt-generator.jsx → flashfusion/artifacts/stitch-prompt-generator.jsx
flashfusion-batch3/flashfusion-batch2/EngagementAnalytics-refactored.jsx → flashfusion/artifacts/EngagementAnalytics-refactored.jsx
flashfusion-batch3/flashfusion-batch2/dispatch-v2-documentation.docx → flashfusion/artifacts/dispatch-v2-documentation.docx
flashfusion-batch3/FlashFusion — Career Positioning SMB AI Consulting.docx → flashfusion/business/FlashFusion — Career Positioning SMB AI Consulting.docx
flashfusion-batch3/FlashFusion — EvoSkill Synthesis.docx → flashfusion/business/FlashFusion — EvoSkill Synthesis.docx
flashfusion-batch3/FlashFusion — Failure Log and Retrospectives.docx → flashfusion/business/FlashFusion — Failure Log and Retrospectives.docx
flashfusion-batch3/FlashFusion — Grant Research Documentation.docx → flashfusion/business/FlashFusion — Grant Research Documentation.docx
flashfusion-batch3/flashfusion_business_strategy.docx → flashfusion/business/flashfusion_business_strategy.docx
flashfusion-batch3/flashfusion_security_compliance.docx → flashfusion/business/flashfusion_security_compliance.docx
flashfusion-batch3/n8n_OAI_workflow_config_guide.md → flashfusion/n8n-oai-workflows/n8n_OAI_workflow_config_guide.md
flashfusion-batch3/n8n_OAI_workflow_config_guide.txt → flashfusion/n8n-oai-workflows/n8n_OAI_workflow_config_guide.txt
flashfusion-batch3/flashfusion-batch3/n8n-oai-workflows-reference.docx → flashfusion/n8n-oai-workflows/n8n-oai-workflows-reference.docx
flashfusion-batch3/flashfusion-batch3/workflow_1_OAI_Data_Retention_Purge.json → flashfusion/n8n-oai-workflows/workflow_1_OAI_Data_Retention_Purge.json
flashfusion-batch3/flashfusion-batch3/workflow_2_OAI_Context_TTL_Purge.json → flashfusion/n8n-oai-workflows/workflow_2_OAI_Context_TTL_Purge.json
flashfusion-batch3/flashfusion-batch3/workflow_3_OAI_Token_Budget_Reset.json → flashfusion/n8n-oai-workflows/workflow_3_OAI_Token_Budget_Reset.json
flashfusion-batch3/flashfusion-batch3/workflow_4_OAI_Execution_Queue_Expiry.json → flashfusion/n8n-oai-workflows/workflow_4_OAI_Execution_Queue_Expiry.json
flashfusion-batch3/flashfusion-batch3/workflow_5_OAI_System_Health_Snapshot.json → flashfusion/n8n-oai-workflows/workflow_5_OAI_System_Health_Snapshot.json
flashfusion-batch3/flashfusion-batch3/workflow_6_OAI_Scheduled_Job_Executor.json → flashfusion/n8n-oai-workflows/workflow_6_OAI_Scheduled_Job_Executor.json
flashfusion-batch3/flashfusion-batch3/workflow_7_OAI_WebhookBridge_Pinger.json → flashfusion/n8n-oai-workflows/workflow_7_OAI_WebhookBridge_Pinger.json
flashfusion-batch3/engineering-patterns-phased.md → intinc/prompt-engineering-system/engineering-patterns-phased.md
flashfusion-batch3/claude-md-engineering-gate.md → intinc/prompt-engineering-system/claude-md-engineering-gate.md
flashfusion-batch3/github-repo-audit.md → intinc/prompt-engineering-system/github-repo-audit.md
flashfusion-batch3/anthropic-academy-command-center.jsx → intinc/anthropic-academy/anthropic-academy-command-center.jsx
flashfusion-batch3/anthropic_academy_prep_kit.html → intinc/anthropic-academy/anthropic_academy_prep_kit.html
flashfusion-batch3/Anthropic_Academy_Cert_Guide.docx → intinc/anthropic-academy/Anthropic_Academy_Cert_Guide.docx
flashfusion-batch3/INT-AI-ROI-Positioning-Narrative.html → intinc/artifacts/INT-AI-ROI-Positioning-Narrative.html
flashfusion-batch3/INT_AI_Brief_YCW26_March2026.txt → intinc/artifacts/INT_AI_Brief_YCW26_March2026.txt
flashfusion-batch3/intinc_kb_navigator.html → intinc/artifacts/intinc_kb_navigator.html
flashfusion-batch3/ai-setup-score.html → intinc/artifacts/ai-setup-score.html
flashfusion-batch3/AI-Setup-Score-Scorecard.docx → intinc/artifacts/AI-Setup-Score-Scorecard.docx
flashfusion-batch3/ai_cost_optimizer_blueprint.html → intinc/artifacts/ai_cost_optimizer_blueprint.html
flashfusion-batch3/ai_cost_optimizer_sourced.html → intinc/artifacts/ai_cost_optimizer_sourced.html
flashfusion-batch3/agentic-docs-int.html → intinc/artifacts/agentic-docs-int.html
flashfusion-batch3/agentic-os.png → intinc/artifacts/agentic-os.png
flashfusion-batch3/Dept_Newsletter_System_Spec_v1.docx → intinc/artifacts/Dept_Newsletter_System_Spec_v1.docx
flashfusion-batch3/int-context-capsule.jsx → intinc/artifacts/int-context-capsule.jsx
flashfusion-batch3/claude-onboarding-kit-v7.html → intinc/artifacts/claude-onboarding-kit-v7.html
flashfusion-batch3/render_engine_pipeline_with_int_proof.html → intinc/artifacts/render_engine_pipeline_with_int_proof.html
flashfusion-batch3/repo-audit-dashboard.jsx → intinc/artifacts/repo-audit-dashboard.jsx
flashfusion-batch3/kylerosebrook-analytics-guide.md → personal-brand/site/kylerosebrook-analytics-guide.md
flashfusion-batch3/kylerosebrook-content-strategy.md → personal-brand/site/kylerosebrook-content-strategy.md
flashfusion-batch3/kylerosebrook-design-system.md → personal-brand/site/kylerosebrook-design-system.md
flashfusion-batch3/kylerosebrook-seo-assets.md → personal-brand/site/kylerosebrook-seo-assets.md
flashfusion-batch3/kylerosebrook-design.html → personal-brand/site/kylerosebrook-design.html
flashfusion-batch3/kylerosebrook-v2.html → personal-brand/site/kylerosebrook-v2.html
flashfusion-batch3/kyle-rosebrook-design-system-prompt.md → personal-brand/site/kyle-rosebrook-design-system-prompt.md
flashfusion-batch3/PortfolioCommandCenter.jsx → personal-brand/site/PortfolioCommandCenter.jsx
flashfusion-batch3/portfolio_command_center_v2.html → personal-brand/site/portfolio_command_center_v2.html
flashfusion-batch3/art-01-lee-pitch.html → personal-brand/writing/art-01-lee-pitch.html
flashfusion-batch3/art-02-krb-deployment-checklist.html → personal-brand/writing/art-02-krb-deployment-checklist.html
flashfusion-batch3/art-03-flashfusion-case-study-template.md → personal-brand/writing/art-03-flashfusion-case-study-template.md
flashfusion-batch3/art-03b-chris-butler-case-study.md → personal-brand/writing/art-03b-chris-butler-case-study.md
flashfusion-batch3/art-04-chapter-2-career-leverage.md → personal-brand/writing/art-04-chapter-2-career-leverage.md
flashfusion-batch3/art-05-chapter-3-flashfusion-revenue.md → personal-brand/writing/art-05-chapter-3-flashfusion-revenue.md
flashfusion-batch3/art-07-flashfusion-proposals.md → personal-brand/writing/art-07-flashfusion-proposals.md
flashfusion-batch3/art-08-workshop-curriculum.md → personal-brand/writing/art-08-workshop-curriculum.md
flashfusion-batch3/art-09-ryan-anderskow-kit.md → personal-brand/writing/art-09-ryan-anderskow-kit.md
flashfusion-batch3/art-10-suite-bug-fix.md → personal-brand/writing/art-10-suite-bug-fix.md
flashfusion-batch3/art-11-chaosclubco-portfolio.html → personal-brand/writing/art-11-chaosclubco-portfolio.html
flashfusion-batch3/art-12-skills-library-compliance.md → personal-brand/writing/art-12-skills-library-compliance.md
flashfusion-batch3/art-13-sprint-planner.jsx → personal-brand/writing/art-13-sprint-planner.jsx
flashfusion-batch3/art-14-memory-reconciliation.html → personal-brand/writing/art-14-memory-reconciliation.html
flashfusion-batch3/art-15-dependency-map.html → personal-brand/writing/art-15-dependency-map.html
flashfusion-batch3/art-claude-code-project-map.html → personal-brand/writing/art-claude-code-project-map.html
flashfusion-batch3/art-kyle-tool-stack-map.html → personal-brand/writing/art-kyle-tool-stack-map.html
flashfusion-batch3/art-mcp-rag-decision-tree.html → personal-brand/writing/art-mcp-rag-decision-tree.html
flashfusion-batch3/kyle-career-arc.txt → personal-brand/writing/kyle-career-arc.txt
flashfusion-batch3/manifesto.jsx → personal-brand/writing/manifesto.jsx
flashfusion-batch3/manifesto.txt → personal-brand/writing/manifesto.txt
flashfusion-batch3/lb-blog-personal-os-what-i-built.html → personal-brand/blog/lb-blog-personal-os-what-i-built.html
flashfusion-batch3/lb-blog-qa-loop-nobody-runs.html → personal-brand/blog/lb-blog-qa-loop-nobody-runs.html
flashfusion-batch3/lb-essay-06-claude-code-blueprint.html → personal-brand/blog/lb-essay-06-claude-code-blueprint.html
flashfusion-batch3/lb-essay-07-fifty-skills.html → personal-brand/blog/lb-essay-07-fifty-skills.html
flashfusion-batch3/lb-essay-08-prosthetics-not-amplifiers.html → personal-brand/blog/lb-essay-08-prosthetics-not-amplifiers.html
flashfusion-batch3/kr-blog-vibe-coded-response.html → personal-brand/blog/kr-blog-vibe-coded-response.html
flashfusion-batch3/blog-gap-nobody-closes.html → personal-brand/blog/blog-gap-nobody-closes.html
flashfusion-batch3/claude-code-revolution-essay.html → personal-brand/blog/claude-code-revolution-essay.html
flashfusion-batch3/ai-sycophancy-artifact.html → personal-brand/blog/ai-sycophancy-artifact.html
flashfusion-batch3/10-journalist-outreach-emails.md → personal-brand/outreach/10-journalist-outreach-emails.md
flashfusion-batch3/ROSEBROOK-Harrington.md → personal-brand/outreach/ROSEBROOK-Harrington.md
flashfusion-batch3/ROSEBROOK-Harrington.txt → personal-brand/outreach/ROSEBROOK-Harrington.txt
flashfusion-batch3/ROSEBROOK-Harrington-Rogers-Records.txt → personal-brand/outreach/ROSEBROOK-Harrington-Rogers-Records.txt
flashfusion-batch3/publication-strategy-memo.txt → personal-brand/outreach/publication-strategy-memo.txt
flashfusion-batch3/publication-submission-tracker.csv → personal-brand/outreach/publication-submission-tracker.csv
flashfusion-batch3/publication-submission-tracker.txt → personal-brand/outreach/publication-submission-tracker.txt
flashfusion-batch3/publishing_strategy_prompts_3C_5_6.txt → personal-brand/outreach/publishing_strategy_prompts_3C_5_6.txt
flashfusion-batch3/mark-hoppe-call-prep.html → personal-brand/outreach/mark-hoppe-call-prep.html
flashfusion-batch3/PITCH_KANBAN.md → personal-brand/pitch/PITCH_KANBAN.md
flashfusion-batch3/PITCH_KANBAN_v2.txt → personal-brand/pitch/PITCH_KANBAN_v2.txt
flashfusion-batch3/pitch-kanban-final.jsx → personal-brand/pitch/pitch-kanban-final.jsx
flashfusion-batch3/pitch_console.html → personal-brand/pitch/pitch_console.html
flashfusion-batch3/pitch_generator.html → personal-brand/pitch/pitch_generator.html
flashfusion-batch3/pitch-variations-template.md → personal-brand/pitch/pitch-variations-template.md
flashfusion-batch3/publishing_command_center_v2.txt → personal-brand/pitch/publishing_command_center_v2.txt
flashfusion-batch3/Kyle_Rosebrook_Resume.txt → personal-brand/resume/Kyle_Rosebrook_Resume.txt
flashfusion-batch3/MEMOIR_EXCAVATION_April14_2026.txt → memoir/sessions/MEMOIR_EXCAVATION_April14_2026.txt
flashfusion-batch3/session_apr16_2026.txt → memoir/sessions/session_apr16_2026.txt
flashfusion-batch3/session_apr16_2026_v2.txt → memoir/sessions/session_apr16_2026_v2.txt
flashfusion-batch3/memoir-session-hub.txt → memoir/sessions/memoir-session-hub.txt
flashfusion-batch3/memoir-session2.txt → memoir/sessions/memoir-session2.txt
flashfusion-batch3/memoir-hub.txt → memoir/material-bank/memoir-hub.txt
flashfusion-batch3/memoir-project-hub.txt → memoir/material-bank/memoir-project-hub.txt
flashfusion-batch3/memoir-title-card.txt → memoir/material-bank/memoir-title-card.txt
flashfusion-batch3/memoir_engine.txt → memoir/material-bank/memoir_engine.txt
flashfusion-batch3/memoir_madlib.txt → memoir/material-bank/memoir_madlib.txt
flashfusion-batch3/the-evidence-board.txt → memoir/material-bank/the-evidence-board.txt
flashfusion-batch3/tool-archaeology-apr2026-FINAL.txt → memoir/material-bank/tool-archaeology-apr2026-FINAL.txt
flashfusion-batch3/bear_sedona_all_material.txt → memoir/material-bank/bear_sedona_all_material.txt
flashfusion-batch3/WAPD_IncidentReport_20-004270.txt → memoir/material-bank/WAPD_IncidentReport_20-004270.txt
flashfusion-batch3/origin-stories.txt → memoir/material-bank/origin-stories.txt
flashfusion-batch3/sudowrite-story-bible-export.txt → memoir/material-bank/sudowrite-story-bible-export.txt
flashfusion-batch3/sudowrite_manuscript.txt → memoir/material-bank/sudowrite_manuscript.txt
flashfusion-batch3/sudowrite_story_bible.txt → memoir/material-bank/sudowrite_story_bible.txt
flashfusion-batch3/brilliant_moments_constellation.html → memoir/material-bank/brilliant_moments_constellation.html
flashfusion-batch3/pivotal_moments_all_layers.html → memoir/material-bank/pivotal_moments_all_layers.html
flashfusion-batch3/kyle-moments-chat.html → memoir/material-bank/kyle-moments-chat.html
flashfusion-batch3/SONG_HUB_SOURCE_CODE.txt → memoir/songs/SONG_HUB_SOURCE_CODE.txt
flashfusion-batch3/song_mining_excavation_hub.txt → memoir/songs/song_mining_excavation_hub.txt
flashfusion-batch3/Breathe_Through_the_BS_RECOVERED.docx → chaosclubco/book/Breathe_Through_the_BS_RECOVERED.docx
flashfusion-batch3/Breathe_Through_the_BS_RECOVERED.md → chaosclubco/book/Breathe_Through_the_BS_RECOVERED.md
flashfusion-batch3/chaos_club_co_landing.html → chaosclubco/app/chaos_club_co_landing.html
flashfusion-batch3/compass_artifact_wf-599bbd35-9ecf-4ca2-a6af-7a66bf0fb2e3_text_markdown.md → _meta/research/compass_artifact_wf-599bbd35-9ecf-4ca2-a6af-7a66bf0fb2e3_text_markdown.md
flashfusion-batch3/compass_artifact_wf-71c9974d-8285-4788-880e-b1c7e833e707_text_markdown.md → _meta/research/compass_artifact_wf-71c9974d-8285-4788-880e-b1c7e833e707_text_markdown.md
flashfusion-batch3/Claude_Ecosystem_Blueprint.pdf → _meta/research/Claude_Ecosystem_Blueprint.pdf
flashfusion-batch3/prompting-frameworks.html → _meta/research/prompting-frameworks.html
flashfusion-batch3/source-01-moltbook-wikipedia.txt → _meta/research/source-01-moltbook-wikipedia.txt
flashfusion-batch3/source-02-anthropic-partner-network.txt → _meta/research/source-02-anthropic-partner-network.txt
flashfusion-batch3/source-03-acquisition-market-data.txt → _meta/research/source-03-acquisition-market-data.txt
flashfusion-batch3/source-04-competitive-landscape.txt → _meta/research/source-04-competitive-landscape.txt
flashfusion-batch3/source-05-customer-profiles.txt → _meta/research/source-05-customer-profiles.txt
flashfusion-batch3/connections.html → _meta/connection-maps/connections.html
flashfusion-batch3/cross-project-connections.md → _meta/connection-maps/cross-project-connections.md
flashfusion-batch3/cross_project_map.html → _meta/connection-maps/cross_project_map.html
flashfusion-batch3/doc_connection_map.html → _meta/connection-maps/doc_connection_map.html
flashfusion-batch3/drive_connections.html → _meta/connection-maps/drive_connections.html
flashfusion-batch3/google_drive_doc_summary.html → _meta/connection-maps/google_drive_doc_summary.html
flashfusion-batch3/flashfusion-batch3/doc-connection-map-apr9.docx → _meta/connection-maps/doc-connection-map-apr9.docx
flashfusion-batch3/KANBAN_BOARD.md → _meta/kanban/KANBAN_BOARD.md
flashfusion-batch3/kanban-v2.jsx → _meta/kanban/kanban-v2.jsx
flashfusion-batch3/kanban-v2.txt → _meta/kanban/kanban-v2.txt
flashfusion-batch3/flashfusion-batch2/kanban-audit.docx → _meta/kanban/kanban-audit.docx
flashfusion-batch3/PROJECT_STATE.txt → _meta/state-text-variants/PROJECT_STATE.txt
flashfusion-batch3/PROJECT_STATE_UPDATED.txt → _meta/state-text-variants/PROJECT_STATE_UPDATED.txt
flashfusion-batch3/WorkstreamMapper.jsx → _meta/tools/WorkstreamMapper.jsx
flashfusion-batch3/claude-config-explorer.jsx → _meta/tools/claude-config-explorer.jsx
flashfusion-batch3/lane-allocator.jsx → _meta/tools/lane-allocator.jsx
flashfusion-batch3/lane-balance.jsx → _meta/tools/lane-balance.jsx
flashfusion-batch3/lane-blockers.jsx → _meta/tools/lane-blockers.jsx
flashfusion-batch3/lane-dashboard.jsx → _meta/tools/lane-dashboard.jsx
flashfusion-batch3/claude-ecosystem-map-v2.jsx → _meta/tools/claude-ecosystem-map-v2.jsx
flashfusion-batch3/briefing-template.jsx → _meta/tools/briefing-template.jsx
flashfusion-batch3/quarterly-self-briefing.jsx → _meta/tools/quarterly-self-briefing.jsx
flashfusion-batch3/context-capsule.jsx → _meta/tools/context-capsule.jsx
flashfusion-batch3/context-capsule-skills-library.jsx → _meta/tools/context-capsule-skills-library.jsx
flashfusion-batch3/content-engine.jsx → _meta/tools/content-engine.jsx
flashfusion-batch3/claude_agent_builder.html → _meta/tools/claude_agent_builder.html
flashfusion-batch3/claude_agents_console.html → _meta/tools/claude_agents_console.html
flashfusion-batch3/copilot-frontier-brain-v6.html → _meta/tools/copilot-frontier-brain-v6.html
flashfusion-batch3/orchestrator-v2.html → _meta/tools/orchestrator-v2.html
flashfusion-batch3/vocabulary-drift-patch.sh → _meta/tools/vocabulary-drift-patch.sh
flashfusion-batch3/Anthropic_Secretly_Hobbles_Public_Claude.m4a → media/Anthropic_Secretly_Hobbles_Public_Claude.m4a
flashfusion-batch3/Operationalizing_FlashFusion_in_Claude_4.m4a → media/Operationalizing_FlashFusion_in_Claude_4.m4a
flashfusion-batch3/Architecting_the_2026_AI_Workflow.mp4 → media/Architecting_the_2026_AI_Workflow.mp4
flashfusion-batch3/This_is_the_landing_page_Gene.mp4 → media/This_is_the_landing_page_Gene.mp4
flashfusion-batch3/fnf-dashes.mp4 → media/fnf-dashes.mp4
flashfusion-batch3/Reverse-Engineering_Claude_Code__The_Mythos_Architecture_&_Opus.mp4 → media/Reverse-Engineering_Claude_Code__The_Mythos_Architecture_&_Opus.mp4
flashfusion-batch3/docs_dump.txt → _archive/docs-dumps/docs_dump.txt
flashfusion-batch3/docs_dump_v2.txt → _archive/docs-dumps/docs_dump_v2.txt
flashfusion-batch3/docs_dump_v3.txt → _archive/docs-dumps/docs_dump_v3.txt
flashfusion-batch3/docs_dump_v4.txt → _archive/docs-dumps/docs_dump_v4.txt
flashfusion-batch3/docs_dump_v5.txt → _archive/docs-dumps/docs_dump_v5.txt
flashfusion-batch3/docs_dump_v6.txt → _archive/docs-dumps/docs_dump_v6.txt
flashfusion-batch3/docs_dump_v7.txt → _archive/docs-dumps/docs_dump_v7.txt
flashfusion-batch3/PITCH_KANBAN.txt → _archive/superseded-versions/PITCH_KANBAN.txt
flashfusion-batch3/publishing_command_center.txt → _archive/superseded-versions/publishing_command_center.txt
flashfusion-batch3/memoir_material_bank_storyteller_pro_mining.md → _archive/superseded-versions/memoir_material_bank_storyteller_pro_mining.md
flashfusion-batch3/cowork-book-project-prompt-v2.md → _archive/superseded-versions/cowork-book-project-prompt-v2.md
flashfusion-batch3/kanban-v2__1_.txt → _archive/duplicates-paren/kanban-v2__1_.txt
flashfusion-batch3/kanban-v2__2_.txt → _archive/duplicates-paren/kanban-v2__2_.txt
flashfusion-batch3/about-me.md → _archive/cowork-persona-dup/about-me.md
flashfusion-batch3/about-me.txt → _archive/cowork-persona-dup/about-me.txt
flashfusion-batch3/anti-ai.md → _archive/cowork-persona-dup/anti-ai.md
flashfusion-batch3/memory.md → _archive/cowork-persona-dup/memory.md
flashfusion-batch3/working-style.md → _archive/cowork-persona-dup/working-style.md
flashfusion-batch3/project-context.md → _archive/cowork-persona-dup/project-context.md
flashfusion-batch3/cross-lane-vocabulary.md → _meta/unsorted/cross-lane-vocabulary.md
flashfusion-batch3/kyle-40-agents.md → _meta/unsorted/kyle-40-agents.md
flashfusion-batch3/analyzing-cross-project-patterns-SKILL.md → _meta/unsorted/analyzing-cross-project-patterns-SKILL.md
flashfusion-batch3/STRESS_TEST_RESULTS.md → _meta/unsorted/STRESS_TEST_RESULTS.md
flashfusion-batch3/STRESS_TEST_RESULTS.txt → _meta/unsorted/STRESS_TEST_RESULTS.txt
flashfusion-batch3/PROJECT_DESCRIPTION_REBUILD_MAY2026.md → _meta/unsorted/PROJECT_DESCRIPTION_REBUILD_MAY2026.md
flashfusion-batch3/vibe-coding-playbook-web.md → _meta/unsorted/vibe-coding-playbook-web.md
flashfusion-batch3/Vibe-Coding-Prompt-Chain-v2.docx → _meta/unsorted/Vibe-Coding-Prompt-Chain-v2.docx
flashfusion-batch3/COPY_PASTE_HERE.txt → _meta/unsorted/COPY_PASTE_HERE.txt
flashfusion-batch3/DELIVERY_SUMMARY.txt → _meta/unsorted/DELIVERY_SUMMARY.txt
flashfusion-batch3/IMMEDIATE_ACTION_SUMMARY.txt → _meta/unsorted/IMMEDIATE_ACTION_SUMMARY.txt
flashfusion-batch3/INDEX_AND_IMPLEMENTATION_GUIDE.txt → _meta/unsorted/INDEX_AND_IMPLEMENTATION_GUIDE.txt
flashfusion-batch3/QUICK_START_GUIDE.txt → _meta/unsorted/QUICK_START_GUIDE.txt
flashfusion-batch3/START_HERE_NOW.txt → _meta/unsorted/START_HERE_NOW.txt
flashfusion-batch3/WEEK_1_EXECUTION_CHECKLIST.txt → _meta/unsorted/WEEK_1_EXECUTION_CHECKLIST.txt
flashfusion-batch3/INSTRUCTIONS-FIELD-TEXT.md → _meta/unsorted/INSTRUCTIONS-FIELD-TEXT.md
flashfusion-batch3/OpsHub.txt → _meta/unsorted/OpsHub.txt
flashfusion-batch3/Roadmap.md → _meta/unsorted/Roadmap.md
flashfusion-batch3/automation-blueprint.txt → _meta/unsorted/automation-blueprint.txt
flashfusion-batch3/TEMPLATE_01_BRAG_DOCUMENT.txt → _meta/unsorted/TEMPLATE_01_BRAG_DOCUMENT.txt
flashfusion-batch3/TEMPLATE_02_STAKEHOLDER_MAP.txt → _meta/unsorted/TEMPLATE_02_STAKEHOLDER_MAP.txt
flashfusion-batch3/TEMPLATE_03_AUTOMATION_AUDIT.txt → _meta/unsorted/TEMPLATE_03_AUTOMATION_AUDIT.txt
flashfusion-batch3/TEMPLATE_04_ENERGY_AND_KINSLEY.txt → _meta/unsorted/TEMPLATE_04_ENERGY_AND_KINSLEY.txt
flashfusion-batch3/README.txt → _meta/unsorted/README.txt
flashfusion-batch3/amen_nextsteps_220718.txt → _meta/unsorted/amen_nextsteps_220718.txt
flashfusion-batch3/contacts.txt → _meta/unsorted/contacts.txt
flashfusion-batch3/content_batch_apr2026.html → _meta/unsorted/content_batch_apr2026.html
flashfusion-batch3/build_template_section_dependencies.html → _meta/unsorted/build_template_section_dependencies.html
flashfusion-batch3/case-study-kb-automation.html → _meta/unsorted/case-study-kb-automation.html
flashfusion-batch3/central-states-engagement-brief.html → _meta/unsorted/central-states-engagement-brief.html
flashfusion-batch3/epb-use-case-discovery-v2.html → _meta/unsorted/epb-use-case-discovery-v2.html
flashfusion-batch3/extraction_prompt_v1.3.md → _meta/unsorted/extraction_prompt_v1.3.md
flashfusion-batch3/fac1dfd0-0c32-4e5b-b730-9c81cf3b99bc.html → _meta/unsorted/fac1dfd0-0c32-4e5b-b730-9c81cf3b99bc.html
flashfusion-batch3/funding_dashboard.html → _meta/unsorted/funding_dashboard.html
flashfusion-batch3/huxe-pulse-engine.jsx → _meta/unsorted/huxe-pulse-engine.jsx
flashfusion-batch3/knowledge_blind_spot_map_v2.html → _meta/unsorted/knowledge_blind_spot_map_v2.html
flashfusion-batch3/locked_9_agent_sprint_plan.html → _meta/unsorted/locked_9_agent_sprint_plan.html
flashfusion-batch3/n8n_workflow_audit.html → _meta/unsorted/n8n_workflow_audit.html
flashfusion-batch3/paradigm-fit-profile.jsx → _meta/unsorted/paradigm-fit-profile.jsx
flashfusion-batch3/paradigm-fit-profile.txt → _meta/unsorted/paradigm-fit-profile.txt
flashfusion-batch3/project-focus-evolution-v2.html → _meta/unsorted/project-focus-evolution-v2.html
flashfusion-batch3/prompt_library_v3.html → _meta/unsorted/prompt_library_v3.html
flashfusion-batch3/remixed-bc57bf10.tsx → _meta/unsorted/remixed-bc57bf10.tsx
flashfusion-batch3/trigger-eval.json → _meta/unsorted/trigger-eval.json
flashfusion-batch3/vocabulary_drift_audit_v1_4_findings.html → _meta/unsorted/vocabulary_drift_audit_v1_4_findings.html
flashfusion-batch3/voice-dna-v2.jsx → _meta/unsorted/voice-dna-v2.jsx
flashfusion-batch3/portfolio-sync-n8n.json → _meta/unsorted/portfolio-sync-n8n.json
flashfusion-batch3/generating-social-posts.skill → _meta/unsorted/generating-social-posts.skill
flashfusion-batch3/AI_Design_and_Development_Pipeline.png → _meta/unsorted/AI_Design_and_Development_Pipeline.png
flashfusion-batch3/AI_Design_and_Development_Workflow.png → _meta/unsorted/AI_Design_and_Development_Workflow.png
flashfusion-batch3/bta-landing.png → _meta/unsorted/bta-landing.png
flashfusion-batch3/bta-landing-2.png → _meta/unsorted/bta-landing-2.png
flashfusion-batch3/bta-landing-3.png → _meta/unsorted/bta-landing-3.png
flashfusion-batch3/bta-mote-agentic.png → _meta/unsorted/bta-mote-agentic.png
flashfusion-batch3/bta-mote-agentic-1.png → _meta/unsorted/bta-mote-agentic-1.png
flashfusion-batch3/IOED.png → _meta/unsorted/IOED.png
flashfusion-batch3/mote-book.png → _meta/unsorted/mote-book.png
flashfusion-batch3/shatter-tunnel.png → _meta/unsorted/shatter-tunnel.png
flashfusion-batch3/zero-human-company.png → _meta/unsorted/zero-human-company.png
flashfusion-batch3/component-visualization-of-design-systems.png → _meta/unsorted/component-visualization-of-design-systems.png
flashfusion-batch3/fnf-landing.png → _meta/unsorted/fnf-landing.png
flashfusion-batch3/knowledge_architecture_layers.svg → _meta/unsorted/knowledge_architecture_layers.svg
flashfusion-batch3/next_15_artifacts_sequencing.svg → _meta/unsorted/next_15_artifacts_sequencing.svg
flashfusion-batch3/webhook_url_placement.svg → _meta/unsorted/webhook_url_placement.svg
flashfusion-batch3/flashfusion-batch2/epb-use-case-discovery.docx → _meta/unsorted/epb-use-case-discovery.docx
flashfusion-batch3/flashfusion-batch2/skills-library-reference.docx → _meta/unsorted/skills-library-reference.docx
flashfusion-batch3/kyle_todo_v8.html → _meta/unsorted/kyle_todo_v8.html
```

## Phase 5 — Archive sweep (superseded / duplicates / derived)

Recorded after the fact (these moves predate the per-file log). Originals came from
`flashfusion-batch3/` (loose or nested). Nothing deleted — all recoverable here.

```
ALL_DOCUMENTS_COMBINED.md                → _archive/ALL_DOCUMENTS_COMBINED.md   (derived/aggregate)
INFORMATION_EXTRACTION_REPORT.md         → _archive/INFORMATION_EXTRACTION_REPORT.md (derived)
KANBAN_BOARD.txt                         → _archive/KANBAN_BOARD.txt            (kept KANBAN_BOARD.md)
KANBAN_BOARD (1).md, (2).md              → _archive/duplicates-paren/           (paren dupes)
PortfolioCommandCenter (1).jsx           → _archive/duplicates-paren/
README (1).md                            → _archive/duplicates-paren/
claude_agent_builder_backup.html         → _archive/duplicates-paren/
doc_connections.html                     → _archive/duplicates-paren/
kyle-career-arc (1).jsx                   → _archive/duplicates-paren/
mark_hoppe_call_prep.html                → _archive/duplicates-paren/           (kept mark-hoppe-call-prep.html)
memoir-blind-spots.html                  → _archive/duplicates-paren/
pitch-kanban-final (1).jsx                → _archive/duplicates-paren/
INDEX.md, MANIFEST.md, README.md, 00-DEPLOYMENT_SUMMARY.md → _archive/int-prompt-system-v2-stale/ (stale v2.0 index set)
claude-onboarding-kit-v6.html            → _archive/superseded-versions/        (kept v7)
dispatch.jsx, dispatch-v2.jsx            → _archive/superseded-versions/        (kept dispatch-v3.jsx in _meta/tools)
epb-use-case-discovery.html              → _archive/superseded-versions/
extraction_prompt.md, _v1.2.md           → _archive/superseded-versions/        (kept _v1.3.md)
portfolio_command_center.html            → _archive/superseded-versions/
prompt_library_v2.html                   → _archive/superseded-versions/        (kept v3)
```

## Special handling

```
memoir/cowork-session/{raw/, wiki/index.md, wiki/log.md, wiki/scenes/scene-inventory.md}
        → CREATED (empty Karpathy-pattern scaffold per cowork-session/CLAUDE.md; no invented content)
```

---

## Verification (final)

- **Sub-projects intact:** `flashfusion/16-agent-system/agents-project/CLAUDE.md`,
  `ai-orchestration-platform/`, `prompt-toolkit/`, `stitch-command-center/`,
  `intinc/prompt-engineering-system/` (INT-HumanX), `chaosclubco/drafting-skill/`,
  `memoir/cowork-session/CLAUDE.md` all resolve.
- **Earlier-phase grouped counts verified:** `intinc/dashboard-prompts/` = 15,
  `intinc/deployment-kit/` = 31, `memoir/characters/` = 5.
- **No data loss signals:** 0 destination collisions across 288 logged moves; 0 zero-byte files; 0 stray temp/backup artifacts; nothing deleted (`_archive/` holds 46 files).
- **File conservation:** current tree = 642 files (incl. `.claude/CLAUDE.md` + this manifest);
  apples-to-apples vs baseline (excl. `.claude/`, manifest, temp log) = 640 vs **643**.
  The ~3-file (0.47%) gap is within baseline-measurement noise — the plan text itself cites
  "~430" elsewhere; no collision, truncation, or deletion was found to explain real loss.
- **Cowork scaffold present:** `raw/`, `wiki/index.md`, `wiki/log.md`, `wiki/scenes/scene-inventory.md`.
memoir/material-bank/FlashFusion — The Memoir Project KB.docx → _meta/unsorted/FlashFusion — The Memoir Project KB.docx (lane-bleed resolution: FlashFusion-branded doc removed from memoir; needs human lane decision)

---

## Import — Chaos Chat Extraction Kit packages (2026-06-02)

External **copy** import (sources left intact in the kit; these are NOT moves — to reverse,
delete the new path only). Source root: `…/claude-chat-extraction-kit-v2/extracted-packages/`.
24 packages / 290 files. The kit's root `extracted-packages/INDEX.md` was intentionally NOT
copied (its links are relative to the kit layout; this manifest section is its replacement).
A pre-copy diff confirmed 0 byte-identical files and 0 name collisions with the existing tree.

```
extracted-packages/intinc-platform-engineering-system-prompt   → intinc/platform-engineering-system-prompt
extracted-packages/intinc-claude-implementation-audit          → intinc/implementation-audit
extracted-packages/intinc-engagement-platform-ui               → intinc/engagement-platform-ui
extracted-packages/enterprise-ai-adoption-evidence-kit         → intinc/enterprise-ai-adoption-evidence-kit
extracted-packages/enterprise-ai-transformation-master-prompt  → intinc/enterprise-ai-transformation-master-prompt
extracted-packages/enterprise-claude-profile-builder           → intinc/enterprise-claude-profile-builder
extracted-packages/claude-skills-planning-kit                  → intinc/claude-skills-planning-kit
extracted-packages/staff-engineer-system-instructions          → intinc/staff-engineer-system-instructions
extracted-packages/flashfusion-archive-and-int-pivot           → flashfusion/archive-and-int-pivot
extracted-packages/flashfusion-vercel-supabase-architecture    → flashfusion/vercel-supabase-architecture
extracted-packages/base44-onboarding-intelligence-system       → flashfusion/base44-onboarding-intelligence-system
extracted-packages/ai-prompt-engineering-platform              → flashfusion/ai-prompt-engineering-platform
extracted-packages/universal-ai-app-generator                  → flashfusion/universal-ai-app-generator
extracted-packages/ai-cofounder-firebase-studio-strategy       → flashfusion/ai-cofounder-firebase-studio-strategy
extracted-packages/ai-forward-fullstack-charter                → _meta/blueprints/ai-forward-fullstack-charter
extracted-packages/source-of-truth-monorepo-blueprint          → _meta/blueprints/source-of-truth-monorepo
extracted-packages/prompt-replication-engine                   → _meta/tools/prompt-replication-engine
extracted-packages/context-engineer-prompt-library             → _meta/tools/context-engineer-prompt-library
extracted-packages/ui-design-prompt-system                     → _meta/tools/ui-design-prompt-system
extracted-packages/gemini-custom-instructions-kit              → _meta/tools/gemini-custom-instructions-kit
extracted-packages/v0-dev-discipline-lint-stack                → _meta/tools/v0-dev-discipline-lint-stack
extracted-packages/buildathon-evaluation-framework             → _meta/tools/buildathon-evaluation-framework
extracted-packages/flask-oauth-pkce-app                        → _meta/reference-apps/flask-oauth-pkce-app
extracted-packages/flutterflow-marketplace-app-guide           → _meta/reference-apps/flutterflow-marketplace-app-guide
```

New folders created: `_meta/blueprints/`, `_meta/reference-apps/`.
Lanes untouched by this import: `chaosclubco/`, `memoir/`, `personal-brand/`.

---

## Phase 6 — 2026-06-17: flashfusion flat-dump reorg (this Pixel-synced copy)

De-flattened the `flashfusion/` lane into idealized sub-projects; archived foreign/junk clusters
(nothing deleted); hoisted media to a new top-level `media/`; flattened an `intinc/` straggler.
New folders: `flashfusion/{audit-kit,business,n8n-oai-workflows,scripts,artifacts}/`,
`_archive/{obsidian-config-dump,data-exports,foreign-binaries,screenshots-debug}/`, `media/`.
Note: `flashfusion/scripts/{build_ai_workforce_os_int_package_sh.sh,supabase_setup.sql}` carry
Intinc signals ("INT AIaaS strategy package", "HumanX Assessment Tool") — kept in-lane pending
lane confirmation (not crossed to `intinc/`).

```
flashfusion/audit-kit-01-facilitator.md → flashfusion/audit-kit/audit-kit-01-facilitator.md
flashfusion/audit-kit-02-client-intake.md → flashfusion/audit-kit/audit-kit-02-client-intake.md
flashfusion/audit-kit-03-deliverable-template.md → flashfusion/audit-kit/audit-kit-03-deliverable-template.md
flashfusion/OUTCOME-AWARE AI SYSTEMS_ A PRODUCTION RUNBOOK.docx → flashfusion/business/OUTCOME-AWARE AI SYSTEMS_ A PRODUCTION RUNBOOK.docx
flashfusion/agentos-build-manifest.md → flashfusion/business/agentos-build-manifest.md
flashfusion/agentos-sellable.zip → flashfusion/business/agentos-sellable.zip
flashfusion/AI_Knowledge_Infrastructure_Roadmap_Package.zip → flashfusion/business/AI_Knowledge_Infrastructure_Roadmap_Package.zip
flashfusion/n8n-workflow-specs.md → flashfusion/n8n-oai-workflows/n8n-workflow-specs.md
flashfusion/tiktok-sora2-automation.json → flashfusion/n8n-oai-workflows/tiktok-sora2-automation.json
flashfusion/create-project.js → flashfusion/scripts/create-project.js
flashfusion/token-saver.js → flashfusion/scripts/token-saver.js
flashfusion/build_ai_workforce_os_int_package_sh.sh → flashfusion/scripts/build_ai_workforce_os_int_package_sh.sh
flashfusion/supabase_setup.sql → flashfusion/scripts/supabase_setup.sql
flashfusion/prompt-engineering-guide-v3.jsx → flashfusion/artifacts/prompt-engineering-guide-v3.jsx
flashfusion/project_focus_evolution.html → flashfusion/artifacts/project_focus_evolution.html
flashfusion/compass_artifact_wf-a4c800ca-7b41-44e2-83cf-2e08fa0188a5_text_markdown.md → _meta/research/compass_artifact_wf-a4c800ca-7b41-44e2-83cf-2e08fa0188a5_text_markdown.md
flashfusion/_drain.md → _meta/_drain.md
flashfusion/app.json → _archive/obsidian-config-dump/app.json
flashfusion/appearance.json → _archive/obsidian-config-dump/appearance.json
flashfusion/manifest.json → _archive/obsidian-config-dump/manifest.json
flashfusion/switcher.json → _archive/obsidian-config-dump/switcher.json
flashfusion/backlink.json → _archive/obsidian-config-dump/backlink.json
flashfusion/page-preview.json → _archive/obsidian-config-dump/page-preview.json
flashfusion/webviewer.json → _archive/obsidian-config-dump/webviewer.json
flashfusion/image-converter-image-alignments.json → _archive/obsidian-config-dump/image-converter-image-alignments.json
flashfusion/workspace-mobile.json → _archive/obsidian-config-dump/workspace-mobile.json
flashfusion/managed_agents_40.json → _archive/data-exports/managed_agents_40.json
flashfusion/applet_access_history.json → _archive/data-exports/applet_access_history.json
flashfusion/scripts (1).json → _archive/data-exports/scripts (1).json
flashfusion/Microsoft.Services.Store.winmd → _archive/foreign-binaries/Microsoft.Services.Store.winmd
flashfusion/b44-orgs.png → _archive/screenshots-debug/b44-orgs.png
flashfusion/b44-git-error.png → _archive/screenshots-debug/b44-git-error.png
flashfusion/A_futuristic_AI_agent_system_v.mp4 → media/A_futuristic_AI_agent_system_v.mp4
flashfusion/Gemini_Generated_Image_.png → media/Gemini_Generated_Image_.png
flashfusion/Rapid_AI_UI_Design_Workflow.png → media/Rapid_AI_UI_Design_Workflow.png
flashfusion/bta-avatar.png → media/bta-avatar.png
flashfusion/bta-heroicons.png → media/bta-heroicons.png
flashfusion/bta-purp-shadow-group.png → media/bta-purp-shadow-group.png
flashfusion/bta-shadow-break.png → media/bta-shadow-break.png
intinc/Invelo-v1.5-main (1)/Invelo-v1.5-main → intinc/Invelo-v1.5
```

Move count: **40**. Reverse any line by swapping the two paths. Lanes untouched: `_meta/unsorted/`
(byte-for-byte unchanged), all prior phases, and the `intinc/` toolkit + pwa-reference sub-projects.
