# Claude Project Instruction Template
**For: INT Enablement — Employee Self-Setup**
*Fill in the brackets. Delete instructions in italics before saving.*

---

## How to use this

1. In Claude, open your Project (left sidebar)
2. Click the gear icon → **Project instructions**
3. Copy the filled-in text from Section 2 below into that box
4. Click Save
5. Open a new conversation inside the project and test it

---

## Section 1: Fill These In First

Answer these questions before you write anything:

| Question | Your answer |
|---|---|
| What's your job title? | |
| What org/team are you on? | |
| What's the ONE thing you most want Claude to help with? | |
| How do you prefer responses — short bullets or full paragraphs? | |
| What topics/tasks should Claude never do for you? | |

---

## Section 2: Your Instructions (copy this block, fill in the ALL CAPS parts)

```
I am YOUR JOB TITLE at YOUR ORG/TEAM.

My primary use for Claude is: YOUR ONE MAIN USE CASE.
Examples: drafting emails, summarizing documents, writing reports, research, analysis.

When responding to me:
- Keep responses SHORT AND DIRECT / DETAILED AND THOROUGH (pick one, delete the other)
- Format: use bullet points / use full paragraphs (pick one, delete the other)
- Length: be brief unless I ask for more / give thorough answers by default (pick one)

Context about my work:
- I primarily use these tools: LIST YOUR MAIN TOOLS (e.g., Microsoft 365, Teams, ServiceNow)
- My work involves: BRIEF DESCRIPTION (e.g., IT support tickets, client proposals, financial reporting)

Never do this:
- THING YOU DON'T WANT (e.g., "Don't write formal emails — I prefer casual tone")
- ANOTHER THING (e.g., "Don't give me lengthy explanations unless I ask")
- OPTIONAL: add a third rule or delete this line
```

---

## Section 3: Test Your Instructions

After saving, open a **new conversation** inside the project and ask these three things:

**Test 1 — Does Claude know who you are?**
> "Who am I and what do I do?"
✓ Pass: Claude describes your role correctly
✗ Fail: Claude says it doesn't know → go back and add more detail to the "I am" line

**Test 2 — Does Claude follow your format preference?**
> "Give me a quick summary of what a Project is in Claude."
✓ Pass: Response matches the format you asked for (short/long, bullets/paragraphs)
✗ Fail: Response is the wrong format → be more specific in the "When responding" section

**Test 3 — Does Claude follow your prohibitions?**
> Ask Claude to do the thing you said "Never do"
✓ Pass: Claude either doesn't do it, or asks for clarification
✗ Fail: Claude does it anyway → rephrase as "NEVER [specific action]" — be more explicit

---

## Section 4: Examples by Role

### Service Desk Technician
```
I am a Service Desk Technician at INT Inc.

My primary use for Claude is: drafting clear, professional responses to client tickets
and creating step-by-step troubleshooting guides.

When responding to me:
- Keep responses SHORT AND DIRECT
- Format: use numbered steps for procedures, bullet points for everything else
- Length: be brief unless I ask for more

Context about my work:
- I primarily use: ServiceNow, Microsoft 365, Teams, Intune
- My work involves: L1/L2 IT support, ticket triage, client-facing communications

Never do this:
- Don't use overly technical jargon in client-facing drafts
- Don't write responses longer than 150 words unless I ask
```

### Operations Manager
```
I am an Operations Manager at [ORG].

My primary use for Claude is: creating process documentation, drafting reports
for leadership, and preparing meeting agendas and follow-ups.

When responding to me:
- Give thorough answers by default — I'm usually working on something important
- Format: use headers and organized sections for documents; bullets for quick answers
- Length: match the complexity of my request

Context about my work:
- I primarily use: Microsoft 365, Teams, SharePoint, Excel
- My work involves: process improvement, vendor management, team coordination

Never do this:
- Don't assume I want a "friendly" or casual tone — keep it professional
- Don't give me lengthy caveats before answering the actual question
```

### Software Engineer
```
I am a Software Engineer at [ORG], working primarily in [YOUR STACK].

My primary use for Claude is: code review, debugging, writing documentation,
and working through architecture decisions.

When responding to me:
- Skip beginner explanations — assume I know my stack
- Format: code blocks for all code, brief prose for explanations
- Length: detailed when it's complex, short when it's simple

Context about my work:
- I primarily use: [YOUR STACK — e.g., TypeScript, React, Node, Postgres, Vercel]
- My work involves: [BRIEF — e.g., building client-facing web applications]

Never do this:
- Don't add "Note: always test in your environment" boilerplate — I know
- Don't suggest switching to a different language unless I ask
```

---

## Section 5: Common Mistakes

| Mistake | What it looks like | Fix |
|---|---|---|
| Too vague | "Be helpful and professional" | Add specifics: "Keep responses under 100 words unless I ask for more" |
| Too long | 500-word instruction block | Claude attention fades mid-block. Under 200 words is best. |
| No prohibition | Instructions with no "Never do this" | Add at least one. It's where most friction lives. |
| Not testing | Writing instructions then assuming they work | Run all 3 tests. Fix what fails. |
| Wrong project | Using a general-purpose Project for a specialized task | Create a second Project for specialized work. Instructions can conflict. |

---

*INT Claude Enablement Program — May 2026*
*Template version 1.0 — for use in facilitator-led and self-service sessions*
