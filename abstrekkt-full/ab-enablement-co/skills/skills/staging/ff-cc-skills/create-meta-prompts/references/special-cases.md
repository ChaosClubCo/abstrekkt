<special_cases>
<re_running_completed>
If user wants to re-run an already-completed prompt:

1. Check if prompt is in `completed/` subfolder
2. Move it back to parent folder
3. Optionally backup existing output: `{output}.bak`
4. Execute normally
</re_running_completed>

<output_conflicts>
If output file already exists:

1. For re-runs: Backup existing → `{filename}.bak`
2. For new runs: Should not happen (unique numbering)
3. If conflict detected: Ask user - Overwrite? / Rename? / Cancel?
</output_conflicts>

<commit_handling>
After successful execution:

1. Do NOT auto-commit (user controls git workflow)
2. Mention what files were created/modified
3. User can commit when ready

Exception: If user explicitly requests commit, stage and commit:
- Output files created
- Prompts archived
- Any implementation changes (for Do prompts)
</commit_handling>

<recursive_prompts>
If a prompt's output includes instructions to create more prompts:

1. This is advanced usage - don't auto-detect
2. Present the output to user
3. User can invoke skill again to create follow-up prompts
4. Maintains user control over prompt creation
</recursive_prompts>
</special_cases>
</step_3_execute>

</automated_workflow>

<reference_guides>
**Prompt patterns by purpose:**
- [references/do-patterns.md](references/do-patterns.md) - Execution prompts + output structure
- [references/plan-patterns.md](references/plan-patterns.md) - Planning prompts + plan.md structure
- [references/research-patterns.md](references/research-patterns.md) - Research prompts + research.md structure
- [references/refine-patterns.md](references/refine-patterns.md) - Iteration prompts + versioning

**Shared templates:**
- [references/summary-template.md](references/summary-template.md) - SUMMARY.md structure and field requirements
- [references/metadata-guidelines.md](references/metadata-guidelines.md) - Confidence, dependencies, open questions, assumptions

**Supporting references:**
- [references/question-bank.md](references/question-bank.md) - Intake questions by purpose
- [references/intelligence-rules.md](references/intelligence-rules.md) - Extended thinking, parallel tools, depth decisions
</reference_guides>

<success_criteria>
**Prompt Creation:**
- Intake gate completed with purpose and topic identified
- Chain detection performed, relevant files referenced
- Prompt generated with correct structure for purpose
- Folder created in `.prompts/` with correct naming
- Output file location specified in prompt
- SUMMARY.md requirement included in prompt
- Metadata requirements included for Research/Plan outputs
- Quality controls included for Research outputs (verification checklist, QA, pre-submission)
- Streaming write instructions included for Research outputs
- Decision tree presented

**Execution (if user chooses to run):**
- Dependencies correctly detected and ordered
- Prompts executed in correct order (sequential/parallel/mixed)
- Output validated after each completion
- SUMMARY.md created with all required sections
- One-liner is substantive (not generic)
- Failed prompts handled gracefully with recovery options
- Successful prompts archived to `completed/` subfolder
- SUMMARY.md displayed inline in results
- Results presented with decisions/blockers flagged

**Research Quality (for Research prompts):**
- Verification checklist completed
- Quality report distinguishes verified from assumed claims
- Sources consulted listed with URLs
- Confidence levels assigned to findings
- Critical claims verified with official documentation
</success_criteria>
<result_presentation>
<single_result>
```
✓ Executed: 001-auth-research
✓ Created: .prompts/001-auth-research/SUMMARY.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Auth Research Summary

**JWT with jose library and httpOnly cookies recommended**

## Key Findings
• jose outperforms jsonwebtoken with better TypeScript support
• httpOnly cookies required (localStorage is XSS vulnerable)
• Refresh rotation is OWASP standard

## Decisions Needed
None - ready for planning

## Blockers
None

## Next Step
Create auth-plan.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What's next?
1. Create planning prompt (auth-plan)
2. View full research output
3. Done
4. Other
```

Display the actual SUMMARY.md content inline so user sees findings without opening files.
</single_result>

<chain_result>
```
✓ Chain completed: auth workflow

Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
001-auth-research
**JWT with jose library and httpOnly cookies recommended**
Decisions: None • Blockers: None

002-auth-plan
**4-phase implementation: types → JWT core → refresh → tests**
Decisions: Approve 15-min token expiry • Blockers: None

003-auth-implement
**JWT middleware complete with 6 files created**
Decisions: Review before Phase 2 • Blockers: None
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All prompts archived. Full summaries in .prompts/*/SUMMARY.md

What's next?
1. Review implementation
2. Run tests
3. Create new prompt chain
4. Other
```

For chains, show condensed one-liner from each SUMMARY.md with decisions/blockers flagged.
</chain_result>
</result_presentation>
