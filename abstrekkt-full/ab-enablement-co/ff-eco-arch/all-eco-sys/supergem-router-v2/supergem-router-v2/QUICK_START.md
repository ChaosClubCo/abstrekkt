# SuperGem Prompt Router - Quick Start Tutorial

**5-Minute Guide to Your First Compiled Prompt**

## Step 1: Install the Router (2 minutes)

### For Gemini AI Studio
1. Open [AI Studio](https://aistudio.google.com/)
2. Click "New Prompt" → "System Instructions"
3. Copy entire contents of `system_prompt.md`
4. Paste into System Instructions field
5. Click "Save"

### For Custom Gem
1. Open your Gem configuration
2. Navigate to "Instructions" or "System Prompt"
3. Copy entire contents of `system_prompt.md`
4. Paste and save

## Step 2: Choose Your First Template (30 seconds)

**Scenario: You need to audit a repo for production readiness**

Open: `templates/01_repo_audit.md`

## Step 3: Customize the Input Block (1 minute)

Copy this complete block:

```
GOAL:
Audit the repository I provide, identify production gaps, and output a prioritized roadmap plus a PR-by-PR delivery plan with acceptance criteria.

CONTEXT:
- Platform: GitHub repo (Next.js app with Supabase backend)
- Audience: senior engineering + product stakeholders
- Definition of done: can ship to real users with monitoring, security baseline, CI, and docs

CONSTRAINTS:
- No breaking changes unless explicitly flagged and justified
- Do not request secrets; propose env var names only
- Assume least-privilege and secure-by-default

INPUTS:
# My E-commerce App

Next.js 14 app with Stripe payments and Supabase database.

## Current Structure
- `/app` - Next.js app router
- `/components` - React components
- `/lib` - Supabase client
- `/api` - API routes

## package.json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "stripe": "^14.0.0"
  }
}

OUTPUT NEEDS:
- Markdown
- Sections: Executive summary; Risks; Gaps; Roadmap (WSJF if possible); PR plan; Acceptance criteria; Smoke tests; CLAIMS CHECK

MODE SWITCHES:
- ReasoningEngine=TreeOfThoughts
- Framework=RISEN
- OutputFormat=Markdown
```

## Step 4: Paste into Router (10 seconds)

1. Open your router (Gemini/AI Studio/Gem)
2. Paste the customized input block
3. Send

## Step 5: Get Your Compiled Prompt (30 seconds)

The router will output two artifacts:

### A) ROUTING CARD (Example)

```
Selected Configuration:
- ReasoningEngine: TreeOfThoughts
- Framework: RISEN
- OutputFormat: Markdown

Rationale:
- TreeOfThoughts explores multiple audit approaches (security-first vs. speed-first vs. cost-first)
- RISEN provides structured role → instructions → steps → end goal
- Markdown output supports readable roadmaps and PR plans
```

### B) FINAL PROMPT (Example)

```markdown
ROLE:
You are a Senior Platform Engineer specializing in production readiness audits. Your expertise includes security, observability, CI/CD, and scaling strategies.

INSTRUCTIONS:
Audit the provided Next.js e-commerce repository for production readiness. Identify gaps in:
1. Security (auth, secrets management, input validation)
2. Observability (logging, monitoring, error tracking)
3. CI/CD (automated tests, deployment pipeline)
4. Documentation (README, API docs, runbooks)

... [continues with full prompt]
```

## Step 6: Execute the Compiled Prompt (1 minute)

1. Copy the FINAL PROMPT section (inside the code block)
2. Open a new chat with Gemini/Claude/ChatGPT
3. Paste and send
4. Get your production readiness audit

## What Just Happened?

✓ **You** provided the raw task + context  
✓ **Router** selected optimal reasoning engine + framework  
✓ **Router** compiled a production-ready prompt with guardrails  
✓ **Executor agent** runs the prompt and delivers results  

## Common Scenarios

### Scenario 1: Feature to PRD
**Template**: `02_feature_to_prd.md`  
**Use when**: You have rough feature ideas and need a spec  
**Output**: Complete PRD with MVP scope, requirements, data model  

### Scenario 2: Security Review
**Template**: `05_security_review.md`  
**Use when**: You need a threat model before shipping  
**Output**: OWASP-aligned threat analysis with mitigations  

### Scenario 3: Incident Postmortem
**Template**: `09_incident_postmortem.md`  
**Use when**: System went down and you need blameless analysis  
**Output**: Root cause analysis + action items with owners  

## Pro Tips

### Tip 1: Let Defaults Work
If you don't specify MODE SWITCHES, router uses safe defaults:
- ReasoningEngine=FirstPrinciples
- Framework=RISEN
- OutputFormat=Markdown

### Tip 2: Override When Needed
Need JSON output? Add to MODE SWITCHES:
```
MODE SWITCHES:
- OutputFormat=JSONOnly
```

### Tip 3: Combine Templates
Request multiple in one session:
```
Please compile:
1. Template 02 (Feature to PRD) for: [feature description]
2. Template 04 (Database Schema) for: [same feature]
```

### Tip 4: Custom Tasks
Don't see a template? Just follow the INPUT BLOCK format:
```
GOAL: [1-5 sentences]
CONTEXT: [bullet points]
CONSTRAINTS: [bullet points]
INPUTS: [paste data]
OUTPUT NEEDS: [format and sections]
MODE SWITCHES: [optional]
```

## Troubleshooting

### Problem: Router is executing the task instead of compiling
**Solution**: Check that system prompt is installed correctly. Look for this line:
> "You do NOT solve the user's task unless explicitly instructed."

### Problem: Output is missing CLAIMS CHECK
**Solution**: Template likely needs MODE SWITCHES. Add:
```
MODE SWITCHES:
- Framework=RISEN
```

### Problem: Compiled prompt has placeholders like [YOUR_API_KEY]
**Solution**: This is by design. Placeholders prevent secret leakage. Replace them when you execute the prompt.

## Next Steps

1. Try all 10 templates to understand their use cases
2. Create a custom template for your team's workflows
3. Request ZIP export for team distribution
4. Integrate router into your development workflow

## Questions?

- Review `README.md` for comprehensive documentation
- Check `examples/` directory for sample outputs
- Verify your INPUT BLOCK has all required sections

---

**Total Time**: 5 minutes  
**Success Metric**: You have a copy-pasteable prompt ready to execute  
**Next Template**: Try `02_feature_to_prd.md` to convert feature notes into specs
