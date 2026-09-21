---
name: debug-like-expert
description: >-
  Deep analysis debugging mode for complex issues. Activates methodical investigation protocol with evidence gathering, hypothesis testing, and rigorous verification. Use when standard troubleshooting fails or when issues require systematic root cause analysis. Triggers on: debug this, root cause analysis, systematic debugging, why is this failing, trace this bug, diagnose this issue, investigation protocol, hypothesis testing.
---

<objective>
Deep analysis debugging mode for complex issues. This skill activates methodical investigation protocols — evidence gathering, hypothesis testing, and rigorous verification — when standard troubleshooting has failed.

Treat code you wrote with MORE skepticism than unfamiliar code. Cognitive biases about "how it should work" blind you to actual implementation errors. Use the scientific method to identify root causes rather than applying quick fixes.
</objective>

<context>
This skill activates when standard troubleshooting has failed. The issue requires methodical investigation, not quick fixes. You are in the mindset of a senior engineer who debugs with scientific rigor.

**Important**: If you wrote or modified any code being debugged, your mental model of "how it should work" may be wrong. Treat your own code as guilty until proven innocent — you're blind to your own assumptions.
</context>

<core_principle>
**VERIFY, DON'T ASSUME.** Every hypothesis must be tested. Every "fix" must be validated. No solutions without evidence.

**ESPECIALLY**: Code you designed is guilty until proven innocent. Your intent doesn't matter — only the code's actual behavior matters. Question your own design decisions as rigorously as anyone else's.
</core_principle>

<domain_expertise>
Before investigation, optionally load domain-specific debugging expertise (per-language pitfalls, tools, and error patterns).

**See [references/diagnostic-patterns.md](references/diagnostic-patterns.md)** for:
- The context-scan command that detects project type
- The domain inference table (Python/React/Rust/Swift/iOS/Unity/etc.)
- How to load `~/.claude/skills/expertise/[domain]/` references
- When domain expertise is and isn't needed

If no expertise skills are found, proceed with general methodology (graceful degradation). Domain context is never required for pure logic or algorithm bugs.
</domain_expertise>

<quick_start>

<evidence_gathering>
Before proposing any solution:

**A. Document current state**
- What is the EXACT error message or unexpected behavior?
- What are the EXACT steps to reproduce?
- What is the ACTUAL output vs EXPECTED output?
- When did this start failing (if known)?

**B. Map the system**
- Trace the execution path from entry point to failure point
- Identify all components involved
- Read relevant source files completely, not just scanning
- Note dependencies, imports, and configs affecting this area

**C. Gather external knowledge (when needed)**
- Use MCP servers for API/library/domain details
- Use web search for error strings, framework behaviors, recent changes
- Check official docs for intended vs observed behavior
- Look for known issues, breaking changes, version-specific quirks

See [references/when-to-research.md](references/when-to-research.md) for research strategy.
</evidence_gathering>

<root_cause_analysis>
**A. Form hypotheses** — based on evidence, list possible causes, each tied to specific evidence.

**B. Test each hypothesis** — for each one: What would prove it true? What would prove it false? Design a minimal test, execute it, document the result.

**C. Eliminate or confirm** — don't move forward until you can answer: Which hypothesis is supported? What evidence contradicts the others? What more is needed?

See [references/hypothesis-testing.md](references/hypothesis-testing.md) for scientific-method application.
</root_cause_analysis>

<solution_development>
**Only after confirming root cause:**

**A. Design solution** — what is the MINIMAL change that addresses the root cause? What side effects are possible? What could it break?

**B. Implement with verification** — make the change, add logging/output to verify behavior, document why this addresses the root cause.

**C. Test thoroughly** — does the original issue still occur? Do the reproduction steps now pass? Run relevant tests. Check for regressions in related functionality.

See [references/verification-patterns.md](references/verification-patterns.md) for verification approaches.
</solution_development>

</quick_start>

<critical_rules>
1. **NO DRIVE-BY FIXES**: If you can't explain WHY a change works, don't make it.
2. **VERIFY EVERYTHING**: Test assumptions. Read the actual code. Check the actual behavior.
3. **USE ALL TOOLS**: MCP for external knowledge, web search for errors/docs, extended thinking for complex reasoning, complete file reads for context.
4. **THINK OUT LOUD**: Document your reasoning at each step.
5. **ONE VARIABLE**: Change one thing at a time, verify, then proceed.
6. **COMPLETE READS**: Don't skim code. Read entire relevant files.
7. **CHASE DEPENDENCIES**: Investigate libraries, configs, and external systems involved.
8. **QUESTION PREVIOUS WORK**: Maybe the earlier "fix" was wrong. Re-examine with fresh eyes.
</critical_rules>

## REQUIRED OUTPUT SCHEMA

Every debugging deliverable MUST be reported in this structure. Do not omit a section; if a section is empty, state why.

```markdown
## HYPOTHESES
1. [Most likely cause] — supported by [specific evidence]
2. [Second cause] — supported by [specific evidence]
   (rank 2+; add more as warranted, ordered most → least likely)

## EVIDENCE
[Exact errors, behaviors, outputs, and observations gathered.
 What was checked, what was found, what was ruled out — with file:line refs.]

## ROOT CAUSE
[One sentence naming the actual underlying problem.]

## FIX
1. [First concrete change]
2. [Second concrete change]
   (numbered, minimal, each tied to the root cause)

## VERIFICATION
[The exact command run OR the observable state that proves the fix works
 and does not regress adjacent functionality. Not "it ran" — what was observed.]
```

**HYPOTHESES** must list at least two ranked candidates before any fix is proposed. **ROOT CAUSE** must be a single sentence. **VERIFICATION** must cite a runnable command or a concrete observable state.

<self_verification>
Before starting:
- [ ] Context scan executed to detect domain (see diagnostic-patterns.md)
- [ ] Domain expertise loaded if available and relevant

Before marking complete:
- [ ] Do you understand WHY the issue occurred?
- [ ] Have you verified the fix actually works?
- [ ] Have you re-run the original reproduction steps?
- [ ] Have you checked for side effects / regressions?
- [ ] Can you explain the solution to someone else?
- [ ] Would this fix survive code review?
- [ ] Output reported in the REQUIRED OUTPUT SCHEMA above?

If you can't answer "yes" to all, keep investigating. **Do NOT mark debugging tasks complete until this checklist passes.**
</self_verification>

<references>
- **Diagnostic pattern library & language-specific debugging**: [references/diagnostic-patterns.md](references/diagnostic-patterns.md) — context-scan, domain inference table, per-error-type checklists, loading domain expertise
- **Debugging mindset**: [references/debugging-mindset.md](references/debugging-mindset.md) — first principles, cognitive biases, when to restart with fresh assumptions
- **Investigation techniques**: [references/investigation-techniques.md](references/investigation-techniques.md) — binary search, rubber duck, minimal reproduction, working backwards, adding observability
- **Hypothesis testing**: [references/hypothesis-testing.md](references/hypothesis-testing.md) — falsifiable hypotheses, experiment design, strong vs weak evidence
- **Verification patterns**: [references/verification-patterns.md](references/verification-patterns.md) — definition of "verified", reproduction testing, regression testing
- **Research strategy**: [references/when-to-research.md](references/when-to-research.md) — signals you need external knowledge, search vs reason
</references>

---

## CLAIMS
<!-- [SOURCED] or [GENERATED] labels for assertions in this skill. None yet — footer added by audit fix pass. -->

## COUNTEREXAMPLE
<!-- Known cases where this skill should NOT activate or may produce wrong output -->

## CONTRADICTIONS
<!-- ! Conflicts with other skills or system prompts -->
