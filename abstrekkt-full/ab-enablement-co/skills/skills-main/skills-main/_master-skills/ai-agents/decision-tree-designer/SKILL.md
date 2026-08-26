---
name: decision-tree-designer
description: Design ASCII decision trees for IT support with escalation paths, symptom-to-solution mapping, and clear decision criteria for L1/L2/L3 support workflows. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Decision Tree Designer (IT Support)

## Core Workflow


This skill creates clear, ASCII-based decision trees for IT support procedures with proper escalation paths and decision criteria.

## When to Use This Skill

Trigger when user requests:
- "Create a decision tree for [troubleshooting scenario]"
- "Generate escalation path for [issue]"
- "Map symptoms to solutions for [problem]"
- "Decision flow for [support procedure]"

## ASCII Decision Tree Format

### Basic Structure

```
START: [Initial condition or user symptom]
│
├─► Question or Condition?
│   ├─► YES → [Action or next question]
│   └─► NO → [Alternative action or next question]
│
├─► Another Condition?
│   ├─► YES → [Action]
│   └─► NO → [Action]
│
└─► Final Option
    └─► [Resolution or escalation]
```

### Symbol Legend

| Symbol | Meaning |
|--------|---------|
| `START:` | Entry point |
| `│` | Vertical line (continuation) |
| `├─►` | Branch point |
| `└─►` | Final branch or endpoint |
| `→` | Direction/outcome |
| `✓` | Success endpoint |
| `✗` | Failure endpoint |
| `⚠️` | Warning/critical path |
| `↑` | Escalate up |

## Decision Tree Types

### Type 1: Symptom-to-Solution Mapping

Use when multiple symptoms lead to different solutions.

```
START: User reports issue
│
├─► Symptom: Cannot connect to VPN
│   │
│   ├─► Can user authenticate to Duo Mobile?
│   │   ├─► YES → Check VPN client version
│   │   │   ├─► Version current → Path A: Network troubleshooting
│   │   │   └─► Version outdated → Path B: Update VPN client
│   │   │
│   │   └─► NO → Path C: Duo MFA re-enrollment
│   │       ├─► User has Duo app → Attempt re-enrollment (15 min)
│   │       └─► User doesn't have Duo → Use admin VPN method
│
└─► Symptom: Different issue → See [other KB article]
```

### Type 2: Tier-Based Escalation

Use when decisions involve escalation between support levels.

```
START: L1 receives ticket
│
├─► Is this a known issue with documented fix?
│   ├─► YES → Apply fix from KB-[ID]
│   │   ├─► Fix successful → ✓ Close ticket
│   │   └─► Fix fails → Continue below
│   │
│   └─► NO (unknown issue) → Attempt L1 diagnostics
│       ├─► Diagnostics reveal cause → Apply standard fix
│       └─► Diagnostics inconclusive → ↑ Escalate to L2
│
ESCALATION: L2 investigates
│
├─► L2 can resolve?
│   ├─► YES → Document solution in KB → ✓ Close
│   └─► NO → Requires specialized expertise
│       ├─► Vendor-specific → ↑ Escalate to L4 (vendor)
│       ├─► Infrastructure → ↑ Escalate to L3 (engineer)
│       └─► Policy exception → ↑ Escalate to L4 (manager)
│
FINAL: L3/L4 resolution → Document for KB → ✓ Close
```

### Type 3: Diagnostic Decision Tree

Use when sequential diagnostics determine path.

```
START: BitLocker showing "Suspended"
│
├─► STEP 1: Check for pending BIOS updates
│   ├─► Dell Command Update shows pending BIOS
│   │   └─► Phase 1: Apply BIOS Update → ✓ BitLocker auto-resumes
│   │
│   └─► No pending updates → Continue to STEP 2
│
├─► STEP 2: Check domain connectivity
│   ├─► Run: nltest /dsgetdc:MSM
│   │   ├─► Success (returns DC info) → Domain reachable
│   │   │   └─► Phase 2: TPM Soft Reset → ✓ BitLocker resumes
│   │   │
│   │   └─► Fail (1355 ERROR_NO_SUCH_DOMAIN) → Domain unreachable
│   │       ├─► User CAN connect own VPN
│   │       │   └─► Phase 3: Local VPN connection → ✓ Resume BitLocker
│   │       │
│   │       └─► User CANNOT connect VPN (dormant MFA)
│   │           └─► Phase 4: Admin VPN Method → ✓ Resume BitLocker
│
└─► Still not resolved after all phases?
    └─► ↑ Escalate to L3 (possible TPM hardware issue)
```

### Type 4: Time-Based Decision Path

Use when urgency affects decision.

```
START: Incident reported
│
├─► Severity Assessment
│   ├─► P0 (Service down, all users affected)
│   │   └─► Response: <5 min → Page on-call engineer
│   │       └─► Immediate war room → All hands
│   │
│   ├─► P1 (Major degradation, 10%+ users affected)
│   │   └─► Response: <15 min → Alert L3 team
│   │       └─► Investigate → Escalate if not resolved in 30 min
│   │
│   ├─► P2 (Feature broken, <5% users affected)
│   │   └─► Response: <1 hour → Assign to L2
│   │       └─► Document workaround → Schedule fix
│   │
│   └─► P3 (Minor issue, UI glitch)
│       └─► Response: <24 hours → Add to backlog
│           └─► Plan fix in next sprint
```

## Decision Criteria Formatting

### Clear Questions

Use specific, measurable questions:

✅ **Good:**
- "Is error code 0x80004005 displayed?"
- "Can user ping DC at 10.200.1.10?"
- "Is BitLocker status showing 'Protection On'?"

✗ **Bad:**
- "Is there an error?"
- "Does network work?"
- "Is encryption okay?"

### Actionable Outcomes

Each branch should lead to clear action:

✅ **Good:**
- "→ Apply Fix A: Set SATA mode to AHCI"
- "→ Escalate to L3 with diagnostic output"
- "→ Proceed to Phase 2: Domain Join"

✗ **Bad:**
- "→ Fix the issue"
- "→ Get help"
- "→ Continue"

## Quick Reference Tables

Supplement decision trees with quick reference tables:

### Symptom → Path Mapping

```markdown
| Symptom | Decision Criteria | Path | Est. Time |
|---------|-------------------|------|-----------|
| VPN won't connect | Duo working? | YES → Path A | 10-15 min |
| VPN won't connect | Duo dormant? | YES → Path C | 20-30 min |
| Domain trust error | Computer fell off domain | YES → Path C | 25-40 min |
```

### Escalation Criteria Table

```markdown
| Condition | Escalate To | Urgency | Info Required |
|-----------|-------------|---------|---------------|
| Issue persists after all paths | L3 | High | Diagnostic outputs |
| Error code 0xC0000001 | L2 + Vendor | Critical | Error screenshot |
| >10% user impact | L3 | High | User count, business impact |
```

## Integration with KB Articles

Decision trees should reference KB article IDs:

```
START: Password reset needed
│
├─► User location?
│   ├─► On-premises → KB-PWD-001: Standard Password Reset
│   ├─► Remote, VPN works → KB-PWD-001: Standard Password Reset
│   └─► Remote, VPN fails → KB-PWD-002: Remote Password with VPN Workarounds
│       ├─► Duo active → Path A (Section 6.1)
│       ├─► Duo dormant, worth setup → Path B (Section 6.2)
│       └─► Duo dormant, skip setup → Path A Variant (Section 6.1)
```

## Best Practices

### Keep It Readable

- **Max 3 levels deep** before splitting into sub-trees
- **Max 5 branches** at any decision point
- **Use whitespace** to separate major sections
- **Align symbols** consistently

### Make It Actionable

- Every endpoint should be:
  - ✓ Resolution with verification
  - ↑ Clear escalation with info needed
  - → Link to detailed procedure

### Test with Users

- L1 agents should be able to follow without confusion
- Decision points should be unambiguous
- Outcomes should be clear

### Update Regularly

- Review quarterly or when procedures change
- Add new branches for common edge cases discovered
- Remove obsolete paths

## Example Templates

### Template: Troubleshooting Decision Tree

```
START: [Issue/Symptom]
│
├─► DIAGNOSTIC: [First Check]
│   ├─► Result A → [Immediate fix or next diagnostic]
│   └─► Result B → [Alternative path]
│
├─► DIAGNOSTIC: [Second Check]
│   ├─► Result C → [Solution Path 1]
│   └─► Result D → [Solution Path 2]
│
└─► All diagnostics complete, issue persists?
    └─► ↑ ESCALATE: [Level] with [Required Info]
        └─► [What happens next]
```

### Template: User Self-Service Decision Tree

```
START: I need to [accomplish task]
│
├─► Do you have [prerequisite]?
│   ├─► YES → Proceed to [self-service option]
│   │   └─► [Step-by-step link to KB-XXX]
│   │
│   └─► NO → Request [prerequisite]
│       └─► [How to request, who to contact]
│
└─► Need additional help?
    └─► Contact [Support Channel] with [Info]
```

## Formatting Guidelines

### For Markdown Documents

Use code blocks with plaintext formatting:

````markdown
```
START: Issue description
│
├─► Decision?
│   ├─► YES → Action
│   └─► NO → Action
```
````

### For Word Documents

Use monospace font (Courier New, 10pt) for decision trees to preserve alignment.

### For KB Articles

Place decision tree in dedicated section:

```markdown
## Decision Tree - Path Selection

[Tree here]

### Decision Criteria Quick Reference

[Table here]
```

## Supporting Resources

Refer to:
- `resources/decision-tree-examples.md` - Library of common IT support trees
- `resources/symbol-guide.md` - Complete symbol reference
- `resources/escalation-templates.md` - Escalation path patterns

## Output Format

When creating a decision tree:

1. **Clarify scope** - What decision needs to be made?
2. **Identify decision points** - What are the key questions?
3. **Map outcomes** - Where does each path lead?
4. **Add escalation** - When to escalate and to whom?
5. **Include quick reference** - Supplementary table for fast lookup
6. **Test readability** - Can L1 follow without confusion?

Always:
- Use clear, specific decision criteria
- Provide actionable outcomes
- Include escalation paths
- Link to KB articles where applicable
- Keep max 3 levels deep

Never:
- Use vague questions
- Create circular logic
- Omit escalation criteria
- Forget to update when procedures change
