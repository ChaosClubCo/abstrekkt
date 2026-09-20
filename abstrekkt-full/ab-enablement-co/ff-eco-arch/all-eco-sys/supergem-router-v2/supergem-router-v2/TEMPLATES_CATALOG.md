# Template Catalog

**10 Production-Ready Templates for Common Engineering Workflows**

---

## Template Selection Guide

### By Role

**Engineering Leadership**
- 01: Repo Audit → Production readiness assessment
- 06: Performance Plan → Bottleneck identification & fixes
- 07: Test Strategy → CI/CD gate design
- 09: Incident Postmortem → Blameless root cause analysis

**Product Management**
- 02: Feature to PRD → Spec generation with MVP scope lock
- 08: UX Flow Audit → Conversion optimization

**Backend Engineering**
- 03: API Contract → Schema generation with versioning
- 04: Database Schema → RLS policy design for Supabase/Postgres

**Security Engineering**
- 05: Security Review → Threat modeling (OWASP-style)

**Platform/DevOps**
- 10: Agent Prompt Builder → Generate prompts for Copilot/Claude/Gemini

---

## By Use Case

### Pre-Production Launch
1. **01: Repo Audit** → Identify gaps before launch
2. **05: Security Review** → Threat model validation
3. **07: Test Strategy** → CI gate setup

### Feature Development
1. **02: Feature to PRD** → Convert ideas to specs
2. **03: API Contract** → Define interfaces early
3. **04: Database Schema** → Design data layer
4. **08: UX Flow Audit** → Remove friction

### Incident Response
1. **09: Incident Postmortem** → Learn from failures

### Performance Optimization
1. **06: Performance Plan** → Systematic bottleneck removal

### AI Workflows
1. **10: Agent Prompt Builder** → Meta-prompting for other agents

---

## Template Details

### 01: Audit a Repo for Production Readiness
**Input**: README, package.json, folder tree  
**Output**: Roadmap + PR-by-PR plan with WSJF prioritization  
**Time**: 15-30 min to customize  
**Reasoning**: TreeOfThoughts (explores multiple audit strategies)  
**Framework**: RISEN (structured role → steps → end goal)

---

### 02: Turn Feature Notes into PRD + MVP Scope Lock
**Input**: Rough feature notes, target users  
**Output**: Complete PRD with requirements, data model, API contracts  
**Time**: 20-40 min to customize  
**Reasoning**: FirstPrinciples (rebuilds from core user needs)  
**Framework**: CO-STAR (context, objective, style, tone, audience)

---

### 03: Generate API Contract + JSON Schemas
**Input**: Feature description, existing routes  
**Output**: OpenAPI-like contract with JSON schemas + examples  
**Time**: 10-20 min to customize  
**Reasoning**: SkeletonOfThought (outline first, fill later)  
**Framework**: RTF (role, task, format)  
**Special**: JSONOnly output mode (no markdown prose)

---

### 04: Design Database Schema + RLS Policy Plan
**Input**: Entities, relationships, access rules  
**Output**: Tables, indexes, RLS rules, migration SQL  
**Time**: 15-30 min to customize  
**Reasoning**: FirstPrinciples (fundamental data requirements)  
**Framework**: RACE (role, action, context, expectation)

---

### 05: Security Review + Threat Model (OWASP-Style)
**Input**: Architecture, endpoints, auth flow  
**Output**: Assets, threats, controls, test plan  
**Time**: 20-40 min to customize  
**Reasoning**: SelfCriticism (draft → critique → improve)  
**Framework**: TRACE (task, request, audience, context, example)

---

### 06: Performance Plan (Targets + Bottleneck Map)
**Input**: Stack, current metrics, key screens  
**Output**: KPI targets, profiling steps, top 10 bottlenecks, fixes  
**Time**: 15-30 min to customize  
**Reasoning**: StepBack (restate problem at higher level)  
**Framework**: TAG (task, action, goal)

---

### 07: Test Strategy + Minimal CI Gate
**Input**: Stack, existing tests, CI provider  
**Output**: Test pyramid, exact commands, thresholds, triage flow  
**Time**: 15-25 min to customize  
**Reasoning**: SkeletonOfThought (structure first, fill later)  
**Framework**: RISEN (complete strategy from role to end goal)

---

### 08: UX Flow Audit (Friction Map + Fix Spec)
**Input**: Flow steps, screenshots, target persona  
**Output**: Friction map, a11y issues, fix spec, measurement plan  
**Time**: 15-30 min to customize  
**Reasoning**: TreeOfThoughts (explore multiple UX improvement paths)  
**Framework**: CO-STAR (audience-aware recommendations)

---

### 09: Incident Postmortem (Root Cause + Action Items)
**Input**: Timeline, logs, impact metrics  
**Output**: Blameless postmortem with action items (owners/ETA)  
**Time**: 10-20 min to customize  
**Reasoning**: SelfCriticism (analysis → critique → refine)  
**Framework**: STAR (situation, task, action, result)  
**Special**: BLUF output mode (executive summary first)

---

### 10: Build a "Prompt for Another Agent"
**Input**: Task description, repo context, errors  
**Output**: Copy-paste prompt for Copilot/Claude/Gemini with guardrails  
**Time**: 10-15 min to customize  
**Reasoning**: ReActLoop (thought/action/observation cycles)  
**Framework**: RISEN (complete prompt package)

---

## Template Combinations (Common Workflows)

### Full Feature Cycle
1. Template 02 (Feature to PRD)
2. Template 04 (Database Schema)
3. Template 03 (API Contract)
4. Template 08 (UX Flow Audit)
5. Template 07 (Test Strategy)

### Pre-Launch Audit
1. Template 01 (Repo Audit)
2. Template 05 (Security Review)
3. Template 06 (Performance Plan)

### Post-Incident Learning
1. Template 09 (Incident Postmortem)
2. Template 05 (Security Review) - if security-related
3. Template 07 (Test Strategy) - add regression tests

---

## Customization Tips

### Tip 1: Replace Bracketed Text
All templates use `[Paste: ...]` markers. Replace these with your actual data:
```
INPUTS:
[Paste: README.md, package.json]
→
INPUTS:
# My App
Next.js 14 with Supabase
...
```

### Tip 2: Adjust MODE SWITCHES
Override defaults when needed:
```
MODE SWITCHES:
- OutputFormat=JSONOnly  (if you need structured data)
- OutputFormat=Concise   (if you want shortest possible)
```

### Tip 3: Add Custom Constraints
Extend CONSTRAINTS section:
```
CONSTRAINTS:
- No breaking changes unless justified
- Budget: $500/month max for tools
- Timeline: 2 weeks to production
- Team size: 3 engineers
```

### Tip 4: Specify Audience
Add to CONTEXT:
```
CONTEXT:
- Audience: non-technical stakeholders (use ELI5 language)
- Audience: senior engineers (technical depth expected)
```

---

## Quality Indicators

Every compiled prompt includes:

✓ **Explicit acceptance criteria** ("Output is correct if...")  
✓ **Self-check list** (verification before finalizing)  
✓ **Safety baseline** (no secrets, no destructive actions)  
✓ **CLAIMS CHECK** (realistic failure mode + how to recognize it)

---

## Version History

- **v2.0.0** (2025-01-19): Initial release with 10 templates
  - Added reasoning engine routing
  - Added framework selection
  - Added output format control
  - Separated routing from execution

---

## Next Steps

1. Browse templates in `/templates` directory
2. Copy INPUT BLOCK from chosen template
3. Customize with your data
4. Paste into SuperGem Prompt Router
5. Get compiled prompt + routing card
6. Execute compiled prompt in Gemini/Claude/ChatGPT

**Need help choosing?** See "Template Selection Guide" above or check `QUICK_START.md`.
