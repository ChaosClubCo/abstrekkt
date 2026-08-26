# Persistent memory — settled decisions and permanent context

> Append only. Never rewrite entries. Date new entries when added.
> This file is the source of truth for decisions already made.
> If something is in here, don't re-litigate it unless there's a strong reason.

---

## Identity and origin

**[2024–2025]** Kyle hired at Intinc outside the normal process — offered a role in a department
he hadn't applied for, based on hybrid tech and people skills.

**[2024–2025]** Self-taught AI expertise developed through personal adversity. Origin story
documented and nearly production-ready for public use as a case study / brand narrative.

**[Ongoing]** "Construction over Recovery" is both the memoir thesis and a working philosophy.
Build external scaffolding and systems rather than waiting for ideal internal conditions.

---

## Legal and employment

**[2025]** Outside employment / non-compete analysis complete against Intinc handbook.
Result: no standalone non-compete exists — only an outside employment policy.
FlashFusion consulting is permissible. Do not re-open this question without new information.

---

## Platform and infrastructure decisions

**[2025]** Docker scrapped entirely from the stack. Replaced by Supabase (database/auth)
and Notion (knowledge management). Do not suggest Docker for new builds.

**[2025]** Supabase project `oorstbwcydxwiojrsoim` is DELETED and gone.
Active project: flashnframe-app. ID: etctmappdhpjuwptdbeb. Empty public schema.

**[2025]** B44 GitHub integration broke after migrating 49 apps to a B44 org.
Fix is account-level OAuth disconnect/reconnect — not a project-level issue.

**[2025–2026]** MCP Extensions (.mcpb bundles) crash root cause: cold uv cache on startup.
Durable fix: Task Scheduler uv sync on login. Do not suggest reinstalling extensions first.

**[2026]** Claude Desktop MCP failures root causes resolved:
- Filesystem MCP: was pointing to missing G:\ drive
- Kapture: bridge.js node path was wrong
- ElevenLabs: startup contention with other MCP servers

**[2026]** Wix store gone. FlashFusion is two B44 apps only going forward:
- Consulting ops: audit.flashfusion.co — app ID 6a02ac1bad2b4e37732ef382
- Fusion AI platform: app.flashfusion.co — app ID 68dd8e79ca073475565c8e16
The platform app is the canonical agent infrastructure. No return to Wix.

**[2026]** INTeract (B44 app 691e3ae3bd4916f2e05ae35e) rebuilt as narrow-panel companion
with live B44 data integration. Not a full dashboard — intentionally constrained scope.

---

## Content and brand decisions

**[2026]** FlashFusion publicly positioned with content strategy as primary brand focus.
Content is the top-of-funnel. Platform is the product. Consulting is the revenue bridge.

**[2026]** All three case studies on audit.flashfusion.co rewritten to draw from real experiences.
No fabricated or generic case studies. If a new case study is needed, it must be real.

**[2026]** HeyGen origin story script: Construction over Recovery narrative. In progress.
Format: avatar presenter, scripted delivery. Not a talking head recording.

---

## Skill library decisions

**[2025]** Developing-skills v3.0.0 authored, audited, and installed as the canonical standard.
Gerund naming convention. CLAIMS footers. Progressive disclosure. 500-line rule.

**[2026]** Major skill library audit and rebuild complete: 53 skills, gerund naming compliance,
CLAIMS footers, progressive disclosure. This is the current state of /mnt/skills/user/.

**[2026]** Skill library structure: /mnt/skills/user/ (personal) + /mnt/skills/plugins/ (plugin installs).
Do not suggest reorganizing this structure without strong justification.

---

## Intinc AI program decisions

**[2026]** Claude seat at Intinc: business case formally submitted to Daniel Bell. Approved.
Pending execution (IT provisioning). Do not suggest re-submitting the business case.

**[2026]** Applied for Claude Community Ambassador program (Chicago metro). Status pending.

---

## Remediation and completed work

**[2026]** FlashFusion remediation sprint v1 complete:
- 8 production-ready SKILL.md files
- Full connector audit
- n8n fix runbook (Base44 Bearer + SCH-02 lane field)
- Phase 6 activation guide
- Packaged as: flashfusion-remediation-v1.zip

---

## Permanent IDs and endpoints

| Resource | Value |
|---|---|
| GitHub username | Krosebrook |
| GitHub repo count | 591 (as of mid-2026) |
| n8n instance | krosebrook.app.n8n.cloud |
| Supabase project ID | etctmappdhpjuwptdbeb |
| Cloudflare account | 6625be44cf920108567ca9923c536b12 |
| Notion intel tracker | 362ea14f-b167-810c-a8e6-da32ba90fc4f |
| B44 consulting ops | 6a02ac1bad2b4e37732ef382 |
| B44 Fusion AI platform | 68dd8e79ca073475565c8e16 |
| B44 INTeract | 691e3ae3bd4916f2e05ae35e |

---

## Active blockers (as of June 2026)
<!-- Move items out of here once resolved — add a resolution note and date -->

**[June 2026]** 11 n8n workflows blocked:
- Cause 1: Base44 Bearer credential not set in n8n credential store
- Cause 2: SCH-02 lane field missing from workflow routing logic
- Status: fix runbook exists in flashfusion-remediation-v1.zip. Not yet executed.
