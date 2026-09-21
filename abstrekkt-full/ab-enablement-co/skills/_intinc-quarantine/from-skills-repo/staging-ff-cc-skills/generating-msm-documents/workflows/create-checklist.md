# Workflow: Create Checklist or FreshService Snippet

<required_reading>
1. `/mnt/skills/public/docx/SKILL.md` — docx-js setup
2. `references/brand-spec.md` — MSM branding
3. `references/component-patterns.md` — Checklist and plain text block patterns
</required_reading>

<process>

## Step 1: Determine Output Format

Ask the user (or infer from context):

| Format | When to Use |
|--------|-------------|
| **MSM-branded .docx** | Formal checklist for documentation or handoff |
| **Plain text block** | Copy/paste into FreshService ticket comment |
| **Both** | .docx with plain text version embedded |

Default: Both (matches the template pattern).

## Step 2: Gather Checklist Content

Confirm categories and items. Standard MSM deployment checklist categories:

1. **Hardware** — Device, asset tag, peripherals, power
2. **Network** — Wi-Fi/Ethernet, speed test, VPN
3. **Security** — Login, MFA, BitLocker, Vanta, antivirus, firewall
4. **Software** — Outlook, Teams, baseline apps, telephony, drivers
5. **User Handoff** — Guide provided, walkthrough, confirmations, manager notified
6. **Documentation** — Photos, CMDB, inventory, evidence

Plus: **Escalation Triggers** (WARNING callout with specific failure conditions)

If the user is creating a non-deployment checklist, adapt categories to their topic.

## Step 3: Generate

### For .docx output:
Build using the document shell from `references/component-patterns.md`:
- MSM header with logo
- MSM footer with address/copyright
- H1 title
- INFO callout with usage instructions
- Checklist sections using `checklistSection()` helper
- WARNING callout for escalation triggers
- Plain text block using `plainTextBlock()` helper

### For plain text only:
Generate a formatted text block:
```
=== MSM [TOPIC] CHECKLIST ===

--- CATEGORY ---
[ ] Item 1
[ ] Item 2

--- CATEGORY ---
[ ] Item 1

--- ESCALATION (Contact [NAME] IMMEDIATELY) ---
[ ] Trigger 1
[ ] Trigger 2

Tech: __________
Date/Time: __________
Complete: YES / NO
```

## Step 4: Validate and Deliver

For .docx:
```bash
node create-checklist.js
python scripts/office/validate.py checklist.docx
```

Copy to `/mnt/user-data/outputs/` and present.

For plain text: Output directly in chat for copy/paste.

</process>

<success_criteria>
- Checklist covers all relevant categories for the topic
- Escalation triggers clearly defined with WARNING callout
- Plain text version is FreshService-compatible (no special formatting)
- .docx version passes validation with full MSM branding
- Signature fields included (Tech name, Date/Time, Complete: YES/NO)
</success_criteria>
