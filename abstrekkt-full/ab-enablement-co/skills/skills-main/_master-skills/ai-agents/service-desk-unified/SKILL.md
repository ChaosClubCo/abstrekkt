---
name: service-desk-unified
description: Helps configure and build service desk unified processes. Intelligent multi-tier IT support (L0-L4) with automatic escalation routing. Handles incident triage, troubleshooting, root cause analysis, and vendor coordination. Use when users report issues, troubleshooting any technical problem, performing diagnostics, analyzing incidents, or coordinating complex fixes. Keywords: incident, ticket, issue, error, outage, troubleshoot, diagnose, broken, not working, slow, down.
---

# Service Desk Unified Support

## Overview
This skill provides intelligent, adaptive IT support that automatically routes issues through appropriate support tiers (L0→L1→L2→L3→L4) based on complexity. You don't need to know which tier to use—the skill handles routing, escalation, and handoffs seamlessly.

**Think of it like a hospital emergency department:** Triage nurse → General practitioner → Specialist → Chief of surgery. Each level activates only when needed, with automatic escalation when issues require deeper expertise.

## How It Works

### Automatic Tier Selection
The skill analyzes each issue and routes to the appropriate tier:

**L0 - Self-Service** (Knowledge Base)
- Instant answers to common questions
- Password resets, VPN setup, software installation
- No human intervention needed
- **Auto-escalate to L1 if:** Self-service doesn't resolve in 5 minutes

**L1 - First-Line Support** (Basic Troubleshooting)
- Simple issues, standard runbooks
- Network connectivity, printer issues, basic errors
- Target: <15 minutes resolution
- **Auto-escalate to L2 if:** >15 min OR >5 users affected OR no runbook exists

**L2 - Technical Support** (Advanced Diagnostics)
- Log analysis, configuration issues, component-level troubleshooting
- Requires technical expertise and system access
- Target: <2 hours resolution
- **Auto-escalate to L3 if:** Root cause unknown after 2 diagnostic passes OR code changes needed

**L3 - Expert Support** (Root Cause Analysis)
- System architecture, code-level debugging, cross-system investigation
- RCA documentation, permanent fixes, infrastructure changes
- Target: <24 hours for resolution plan
- **Auto-escalate to L4 if:** Vendor-specific issue OR proprietary systems OR hardware RMA needed

**L4 - Vendor/External** (Specialized Expertise)
- Hardware manufacturers, software vendors, third-party specialists
- Proprietary tools, firmware, source code access
- Managed externally with internal coordination

## Workflow

### Step 1: Intake & Classification
```
User reports issue → Gather info → Classify severity → Assign tier
```

**Severity Matrix:**
| Severity | Impact | Response | Example |
|----------|--------|----------|---------|
| **P0** | Critical - All users | <5 min | Complete system outage |
| **P1** | High - Multiple users | <15 min | Payment processing down |
| **P2** | Medium - Single team | <1 hour | One department can't access app |
| **P3** | Low - Individual | <4 hours | Single user printer issue |
| **P4** | Minimal - Cosmetic | <24 hours | UI display glitch |

**Questions to Ask:**
1. What is the exact symptom? (error message, behavior)
2. When did it start? (timeline, recent changes)
3. Who is affected? (single user, team, all users)
4. What's the business impact? (revenue, compliance, productivity)
5. Has this happened before? (search known issues)

### Step 2: Initial Diagnosis

**Start with L1 approach:**
- Check if there's a runbook → `view references/l1-runbooks.md`
- Run basic health checks → `bash scripts/health_check.py`
- Search known issues → `grep -r "error_code" references/known-issues/`

**Escalation Decision Tree:**
```
Can resolve in <15 min with runbook? → YES → Resolve at L1
  ↓ NO
Multiple users OR no runbook? → YES → Escalate to L2
  ↓ NO
Continue L1 troubleshooting for 15 min → Still unresolved? → Escalate to L2
```

### Step 3: Execute Resolution

**L1 Resolution:**
1. Follow runbook step-by-step
2. Verify fix with user
3. Document actions taken
4. Close ticket

**L2 Resolution:**
1. Load advanced diagnostics → `view references/l2-diagnostics.md`
2. Analyze logs → `bash scripts/log_analyzer.py`
3. Test hypothesis → Apply fix
4. Verify resolution
5. Document for runbook updates

**L3 Resolution:**
1. Load RCA template → `view references/l3-rca-templates.md`
2. Deep investigation (code, architecture, dependencies)
3. Coordinate with teams (engineering, security, ops)
4. Implement permanent fix
5. Post-incident review

**L4 Resolution:**
1. Load vendor escalation guide → `view references/l4-vendor-escalation.md`
2. Prepare detailed logs, reproduction steps
3. Engage vendor support (TAM, SA)
4. Track vendor resolution
5. Implement solution internally

### Step 4: Verification & Closure

**Mandatory Steps:**
- [ ] Issue resolved and verified by user
- [ ] Root cause documented (for L2+)
- [ ] Runbooks updated (if new pattern)
- [ ] Known issues database updated
- [ ] Stakeholders notified
- [ ] Ticket closed with complete documentation

**Post-Incident Review (P0/P1 only):**
- What happened? (timeline)
- Why did it happen? (5 whys analysis)
- How do we prevent recurrence? (action items)
- What did we learn? (process improvements)

## Integration Points

### MCP Servers (Auto-detected)
The skill checks for available MCP servers and uses them when present:
- **Linear**: Auto-create/update incident tickets
- **Sentry**: Fetch error telemetry and stack traces
- **Slack**: Team notifications and status updates
- **GitHub**: Link commits/PRs to incidents
- **PagerDuty**: On-call routing for P0/P1

### Project Knowledge
Always search project knowledge first for:
- Past incidents with similar symptoms
- Company-specific troubleshooting guides
- Architecture documentation
- Team runbooks

### Memory & Chat History
- Check memory for user's environment details
- Search conversation history for related past issues
- Reference previous resolutions

## Security Guardrails

**Input Validation:**
- Sanitize all user-provided data before executing commands
- Validate file paths before reading/writing
- Block destructive commands without explicit approval

**Approval Required For:**
- Service restarts (except L1 runbook-approved)
- Configuration changes affecting >5 users
- Database queries/migrations
- Production system access
- Vendor communications with SLA implications

**PII Protection:**
- Mask passwords, API keys, tokens in logs
- Strip PII from error messages
- Encrypt sensitive data in ticket documentation

## Progressive Disclosure

This SKILL.md contains the orchestration logic (450 lines). Detailed tier-specific content loads on-demand from `references/`:

- `l0-knowledge-base.md` - Self-service articles (loaded when user asks FAQ-style questions)
- `l1-runbooks.md` - Step-by-step procedures (loaded at L1)
- `l2-diagnostics.md` - Advanced troubleshooting (loaded at L2)
- `l3-rca-templates.md` - Root cause analysis (loaded at L3)
- `l4-vendor-escalation.md` - External support coordination (loaded at L4)
- `escalation-matrix.md` - Decision criteria (loaded during triage)
- `known-issues/` - Database of past incidents (searched via grep)

Scripts in `scripts/` execute only when called:
- `health_check.py` - System diagnostics (CPU, memory, disk, network)
- `log_analyzer.py` - Pattern detection in logs
- `ticket_creator.py` - MCP integration for ticketing systems

## Usage Examples

### Example 1: Simple Issue (L1 Resolution)
```
User: "I can't log into the VPN"
Claude: [Classifies as P3, routes to L1]
        [Loads l1-runbooks.md, finds VPN troubleshooting]
        "Let's troubleshoot your VPN connection. First, verify your password hasn't expired..."
        [Follows runbook steps]
        "Issue resolved. Your password was expired. Reset completed."
        [Documents in ticket, closes]
```

### Example 2: Multi-User Issue (Auto-escalate L1→L2)
```
User: "Our team can't access the customer dashboard - getting 503 errors"
Claude: [Classifies as P1, routes to L1]
        [L1 diagnostics: Multiple users affected]
        [Auto-escalates to L2 due to >5 users]
        [Loads l2-diagnostics.md]
        [Runs log_analyzer.py]
        "Found database connection pool exhaustion. Scaling pool from 50→100..."
        [Applies fix, verifies]
        "Dashboard restored. Documenting fix and updating monitoring thresholds."
```

### Example 3: Unknown Root Cause (Auto-escalate L2→L3)
```
User: "Payment processing is intermittently failing"
Claude: [Classifies as P1, routes to L2]
        [Runs diagnostics: Logs show timeouts, no clear pattern]
        [2 diagnostic passes unsuccessful]
        [Auto-escalates to L3]
        [Loads l3-rca-templates.md]
        [Deep investigation: Race condition in distributed locks]
        "Root cause identified. Requires code fix + config change..."
        [Coordinates with engineering team]
        "Permanent fix deployed. Scheduling post-incident review."
```

### Example 4: Vendor Hardware Issue (Auto-escalate L3→L4)
```
User: "Server hardware showing memory errors in diagnostics"
Claude: [Classifies as P2, routes to L2]
        [Diagnostics confirm hardware fault]
        [Escalates to L3 for assessment]
        [L3 determines: Hardware failure, under warranty]
        [Auto-escalates to L4]
        [Loads l4-vendor-escalation.md]
        "Engaging Dell support for RMA process..."
        [Prepares logs, system info, opens vendor ticket]
        [Tracks vendor response]
        "RMA approved. Replacement hardware arriving tomorrow."
```

## Best Practices

### For Users
1. **Provide specifics:** Error messages, screenshots, exact steps
2. **Note timing:** When did it start? Any recent changes?
3. **State impact:** Who's affected? What can't they do?
4. **Try self-service first:** Check knowledge base (L0)

### For Support Teams
1. **Document everything:** Every action, every observation
2. **Search first:** Check known issues before deep troubleshooting
3. **Escalate early:** Don't waste time on issues beyond your tier
4. **Update runbooks:** Turn new solutions into L1 procedures
5. **Blameless culture:** PIRs focus on systems, not people

### For This Skill
1. **Always classify severity first:** Drives response time expectations
2. **Search project knowledge immediately:** Most answers are there
3. **Check for MCP integrations:** Auto-create tickets when available
4. **Follow escalation triggers religiously:** Time limits prevent thrashing
5. **Document for future:** Every resolution improves the knowledge base

## Metrics & SLAs

**Track These KPIs:**
- Mean Time to Acknowledge (MTTA): <5 min for P0, <15 min for P1
- Mean Time to Resolve (MTTR): Varies by severity
- First Contact Resolution Rate: >70% for L1
- Escalation Rate: <30% from L1→L2, <20% from L2→L3
- Recurring Incidents: <10% of total (indicates good problem management)

**Typical Resolution Times:**
- **L1**: 15 minutes average
- **L2**: 2 hours average
- **L3**: 24 hours average (for resolution plan)
- **L4**: Depends on vendor SLA (usually 4-48 hours)

## Common Pitfalls

❌ **Don't:**
- Skip triage/classification (leads to wrong tier assignment)
- Work in silos (L2 should communicate with L1/L3)
- Apply quick fixes without understanding root cause
- Forget to document resolutions
- Ignore patterns across multiple incidents

✅ **Do:**
- Use the escalation matrix consistently
- Update runbooks when you find new solutions
- Communicate status to stakeholders regularly
- Conduct PIRs for P0/P1 incidents
- Build knowledge base from every resolution

## Customization Notes

**To Adapt This Skill:**
1. **Update runbooks** in `references/l1-runbooks.md` with your specific systems
2. **Add known issues** to `references/known-issues/` from your incident history
3. **Configure MCP integrations** for your ticketing/monitoring systems
4. **Adjust SLAs** in the severity matrix to match your organization
5. **Customize scripts** in `scripts/` for your environment

**Organization-Specific Considerations:**
- Replace `[YOUR_SERVICE_URL]` placeholders in runbooks
- Update vendor contact info in L4 escalation guide
- Map team names to support tiers (who handles L2? L3?)
- Define your major incident process (P0 response team)
- Set up monitoring integrations (Sentry, DataDog, etc.)

## Related Skills

This skill works well with:
- **error-tracking**: For Sentry integration and error analysis
- **debug-like-expert**: When L3 needs deep investigation mode
- **test-fixing**: For resolving bugs found during incident investigation
- **git-pushing**: To deploy fixes during incident resolution
- **project-knowledge-search**: Always use first for context

## Support

**Need Help?**
- View tier-specific guides: `view references/[tier]-*.md`
- Check known issues: `bash scripts/search_known_issues.sh "error message"`
- Run health checks: `bash scripts/health_check.py`
- Search past resolutions: Use `conversation_search` or `project_knowledge_search`

**Gaps & Limitations:**
- Cannot access live production systems (requires MCP or API integration)
- Cannot open vendor support tickets directly (provides templates/guidance)
- Runbooks require manual updates (not auto-synced from your ITSM)
- Known issues database needs periodic review/cleanup
- SLA enforcement requires external monitoring (this skill provides guidance only)
