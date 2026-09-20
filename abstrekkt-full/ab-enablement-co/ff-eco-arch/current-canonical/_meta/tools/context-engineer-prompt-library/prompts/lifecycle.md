# Prompts by Lifecycle Stage

Eight stages from the source. One representative directive prompt + justification
each (expand to the full set as you use them). Fill `{{variables}}`.

## 1. Market Research & Validation
```
Validate demand for {{idea}} before I build. Identify the 3 riskiest assumptions,
the cheapest test for each, and a kill criterion. Cite where you're inferring vs
knowing.
```
*Why:* forces falsification over confirmation; a kill criterion prevents sunk-cost building.

## 2. Privacy, Security & Compliance
```
Audit {{feature}} for data handling. Classify every data field (public/internal/
confidential/restricted), flag PII/PHI/PCI, and list the minimum controls per
class. Never echo secrets.
```
*Why:* most privacy failures are mis-classified fields; classify before controls.

## 3. Accessibility & Inclusive Design
```
Review {{screen/flow}} against WCAG 2.2 AA. List failures by impact, give the
fix, and name who is excluded if unfixed. Prioritize keyboard + screen-reader paths.
```
*Why:* accessibility is a first-class stage here, not a last-minute pass.

## 4. DevOps, CI/CD & Release Strategy
```
Design the release path for {{service}}: quality gates, rollback trigger, and the
one metric that says "roll back now." Keep it boring and reversible.
```
*Why:* reversibility beats cleverness; a clear rollback trigger removes hesitation.

## 5. Onboarding
```
Design first-run for {{app}} so a new user reaches their first win in <{{N}}
minutes. Identify the single step most likely to lose them and remove friction there.
```
*Why:* activation hinges on time-to-first-win and the one drop-off step.

## 6. Testing
```
For {{feature}}, generate the test cases that matter: happy path, the 3 likeliest
failure modes, and one nasty edge case. Explain what each protects against.
```
*Why:* tests-that-matter over coverage theater; tie each test to a real risk.

## 7. Crash Reports
```
Given this crash/{{stacktrace}}, give Cause → Fix → Retry. State confidence and
what evidence would confirm the cause. Don't guess silently.
```
*Why:* "most bugs live in confusion, not code" — name the cause, don't paper over it.

## 8. Post-Launch Monitoring & Iteration
```
From {{metrics}}, find where users hesitate, slow, or abandon. Rank by impact,
hypothesize the why, and propose one experiment per top issue.
```
*Why:* monitoring should produce the next experiment, not just a dashboard.
