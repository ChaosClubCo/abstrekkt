# Navigation QA Spec — Refactored Prompt Chain v1.0

**Purpose:** 4-prompt chain that produces a complete navigation test specification + automation blueprint.  
**Why chained:** The original single-shot prompt requested 6+ major deliverables. Claude 4.x models are literal executors — overloaded prompts produce shallow output across all sections. Chaining focuses each prompt on 1–2 deliverables at production depth.  
**Handoff pattern:** Each prompt's output feeds as `<prior_output>` context into the next prompt. Copy-paste the output of Prompt N into the designated slot in Prompt N+1.  
**Estimated total output:** ~12K–16K tokens across all 4 prompts.  
**Test tools default:** Playwright + Jest + Testing Library + axe-core.

---

## Pre-Flight: Fill These Before Running

Before executing Prompt 1, fill in ALL known values below. These get injected into every prompt in the chain via the `<inputs>` block.

```xml
<inputs>
  <app_type>web app</app_type>               <!-- web app | SaaS | internal tool | public app -->
  <framework>React / Next.js</framework>      <!-- React | Next.js | Vue | Angular | etc -->
  <router>Next App Router</router>            <!-- Next App Router | React Router | Angular Router | unknown -->
  <auth>role-based</auth>                     <!-- none | SSO | role-based | unknown -->
  <roles>admin, editor, viewer</roles>        <!-- List all roles, or "unknown" -->
  <primary_nav_items>
    Dashboard, Templates, Library, Members, Settings, Help
  </primary_nav_items>                         <!-- List known items or "unknown" -->
  <settings_subnav_items>
    General, Team, Billing, Integrations, Security
  </settings_subnav_items>                     <!-- List known items or "unknown" -->
  <devices>desktop, tablet, mobile</devices>  <!-- desktop | tablet | mobile -->
  <a11y_standard>WCAG 2.2 AA</a11y_standard>
  <test_tools>
    <e2e>Playwright</e2e>
    <unit>Jest + Testing Library</unit>
    <visual>Playwright snapshots</visual>
    <a11y>axe-core</a11y>
  </test_tools>
</inputs>
```

> **IMPORTANT:** Replace every value above with your actual project data before running. The more you fill in, the less Claude assumes.

---

## Prompt 1 of 4 — Component Inventory + Information Model

**Goal:** Map every navigation level, its components, data requirements, layout rules, and failure modes.  
**Expected output:** ~3K–4K tokens. Structured inventory tables.

```xml
<inputs>
  <!-- PASTE YOUR FILLED-IN INPUTS BLOCK HERE -->
</inputs>

<system_role>
You are a senior QA architect producing a navigation component inventory
for an automated test specification. Your output will be consumed by a
test engineer to build Playwright tests and a requirements traceability matrix.
</system_role>

<context>
This inventory is the foundation for a QA team building regression tests
for a SaaS navigation system. The test suite integrates into CI/CD.
Every component you identify will map to test cases in subsequent steps.
Completeness here prevents gaps downstream.
</context>

<operating_constraints>
- Output must be structured tables and bullet lists — no prose paragraphs.
- If critical info is missing from <inputs>, make best-effort assumptions
  and label them clearly in an ASSUMPTIONS section at the top.
- Use deterministic naming: NAV-L1 (primary), NAV-L2 (secondary),
  NAV-L3 (tertiary), NAV-L4 (page/view), NAV-L5 (overlay).
- Cover ALL 5 navigation levels even if some require assumptions.
- Include failure modes for each level — these feed directly into test cases.
</operating_constraints>

<task_instructions>
For EACH of the 5 navigation levels (primary, secondary, tertiary, page/view, overlay), produce:

1. **Component Inventory Table**
   Columns: ComponentName | RequiredProps | Events | A11yRole | Notes

2. **Information Model**
   - What information belongs at this level
   - What must NOT appear at this level (ownership boundary)
   - Data source (route config, API, static, permission-gated)

3. **Layout & Behavior Rules**
   - Positioning (sticky/fixed/relative)
   - Scroll behavior
   - Collapse/expand behavior
   - Responsive behavior per device (desktop/tablet/mobile)
   - Focus order and keyboard navigation rules
   - ARIA roles and landmarks

4. **Failure Modes** (minimum 3 per level)
   - Description of the failure
   - User impact (severity: critical/high/medium/low)
   - How to detect it (test strategy hint)
</task_instructions>

<output_format>
- Markdown tables for inventories
- Bullet lists for information model and layout rules
- Use ### headings per navigation level (### NAV-L1: Primary Navigation, etc.)
- Start with ## ASSUMPTIONS section
- End with ## GAPS / NEXT INPUTS section listing what would improve accuracy
</output_format>

<examples>
<example name="component_inventory_row">
### NAV-L1: Primary Navigation — Component Inventory

| ComponentName      | RequiredProps                        | Events                    | A11yRole   | Notes                          |
|--------------------|--------------------------------------|---------------------------|------------|--------------------------------|
| Logo               | src, alt, linkTo                     | click                     | link       | Always routes to /dashboard    |
| WorkspaceSelector  | workspaces[], activeId, onSelect     | click, keydown            | listbox    | Visible to admin/editor only   |
| NavItem            | label, icon, route, isActive, badge  | click, focus, keydown     | link       | Active state from route match  |
| CollapseToggle     | isCollapsed, onToggle                | click, keydown            | button     | Persists to localStorage       |
</example>

<example name="failure_mode_row">
### NAV-L1: Primary Navigation — Failure Modes

| Failure                    | Severity | Detection Strategy                              |
|----------------------------|----------|--------------------------------------------------|
| Active state not updating  | High     | E2E: navigate, assert aria-current="page"        |
| Badge count stale          | Medium   | Integration: mock API, verify re-render on update |
| Collapse breaks on resize  | Medium   | E2E: toggle collapse, resize viewport, assert     |
</example>
</examples>

<verification>
After completing all 5 levels, verify:
- Every level has a component inventory table with at least 3 components.
- Every level has at least 3 failure modes.
- No component appears at two levels without explicit justification.
</verification>
```

---

## Prompt 2 of 4 — Requirements Matrix + Test Case Catalog

**Goal:** Transform the component inventory into traceable requirements and exhaustive test cases.  
**Expected output:** ~4K–5K tokens. Two major tables.  
**Dependency:** Requires output from Prompt 1.

```xml
<prior_output>
  <!-- PASTE THE COMPLETE OUTPUT FROM PROMPT 1 HERE -->
</prior_output>

<inputs>
  <!-- PASTE YOUR FILLED-IN INPUTS BLOCK HERE -->
</inputs>

<system_role>
You are a QA architect converting a navigation component inventory into
a requirements traceability matrix and a comprehensive test case catalog.
Every requirement must map to at least one test case. Every test case must
be specific enough to implement without additional clarification.
</system_role>

<context>
The component inventory in <prior_output> defines what exists at each
navigation level. Your job is to define what must be TRUE about each
component (requirements) and how to PROVE it (test cases). This feeds
directly into Playwright test implementations in the next step.
</context>

<operating_constraints>
- Every requirement gets a stable ID: REQ-L{level}-{sequence} (e.g., REQ-L1-001).
- Every test case gets a stable ID: NAV-{category}{level}-{sequence}
  Categories: P=primary, S=secondary, T=tertiary, V=view, O=overlay.
  Example: NAV-P1-001, NAV-S2-003.
- Test types: unit | integration | e2e | a11y | visual | performance | security.
- Priority: P1 (must ship) | P2 (should ship) | P3 (nice to have).
- Risk: critical | high | medium | low.
- Include happy path AND edge case test cases for each requirement.
- Minimum 5 test cases per navigation level.
- Flag flakiness risks on any test case that involves timing, animation, or network.
</operating_constraints>

<task_instructions>
1. **Requirements Matrix**
   Create a table with these columns:
   RequirementID | Level | Description | Priority | Risk | Owner | TestType | TestCaseIDs

   - Extract requirements from the component inventory, layout rules,
     and failure modes in <prior_output>.
   - Every failure mode should generate at least one requirement.
   - Every component with permission gating needs a security requirement.

2. **Test Case Catalog**
   For each test case, provide:

   TestCaseID | Requirement | Preconditions | Steps | Expected Result |
   Assertions | Test Data | Tags | Flakiness Risk

   - Tags should include: smoke, regression, a11y, visual, security,
     responsive, keyboard, permission.
   - Steps must be concrete (e.g., "Click the Settings nav item" not
     "Navigate to settings").
   - Assertions must be code-ready (e.g., "expect(page.url()).toContain('/settings')").
</task_instructions>

<output_format>
- ## REQUIREMENTS MATRIX as a Markdown table
- ## TEST CASE CATALOG grouped by navigation level (### NAV-L1 Tests, etc.)
- Each test case as a sub-table or structured block
- End with ## TRACEABILITY CHECK: list any requirements without test coverage
</output_format>

<examples>
<example name="requirement_row">
| REQ-L1-001 | L1 | Logo click navigates to /dashboard from any page | P1 | Low | FE | e2e | NAV-P1-001 |
| REQ-L1-002 | L1 | Active nav item reflects current route | P1 | High | FE | e2e, unit | NAV-P1-002, NAV-P1-003 |
| REQ-L1-003 | L1 | Nav items respect role-based visibility | P1 | Critical | FE+BE | e2e, security | NAV-P1-010, NAV-P1-011 |
</example>

<example name="test_case_block">
**NAV-P1-001** — Logo navigates to dashboard
- Requirement: REQ-L1-001
- Preconditions: User authenticated, on /templates page
- Steps:
  1. Locate logo element by test-id="nav-logo"
  2. Click logo
  3. Wait for navigation
- Expected: URL is /dashboard, Dashboard nav item has active state
- Assertions:
  ```
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByTestId('nav-item-dashboard')).toHaveAttribute('aria-current', 'page');
  ```
- Test Data: Any authenticated user
- Tags: smoke, regression, navigation
- Flakiness Risk: Low — no animation or network dependency
</example>
</examples>

<verification>
After completing both deliverables:
1. Every RequirementID appears in at least one TestCaseID.
2. Every navigation level has at least 5 test cases.
3. Every P1/Critical requirement has at least one smoke-tagged test.
4. List any gaps in the TRACEABILITY CHECK section.
</verification>
```

---

## Prompt 3 of 4 — E2E User Flows + Automation Blueprint

**Goal:** Define cross-level user journeys and produce implementable Playwright code.  
**Expected output:** ~4K–5K tokens. Flow definitions + 8–10 test implementations.  
**Dependency:** Requires output from Prompts 1 and 2.

```xml
<prior_output>
  <!-- PASTE THE COMBINED OUTPUT FROM PROMPTS 1 AND 2 HERE -->
</prior_output>

<inputs>
  <!-- PASTE YOUR FILLED-IN INPUTS BLOCK HERE -->
</inputs>

<system_role>
You are a staff frontend engineer writing Playwright test implementations
for a navigation system. You produce production-ready test code with
proper page objects, fixtures, and assertion patterns. Your code must be
copy-pasteable into a real test suite with minimal modification.
</system_role>

<context>
The requirements matrix and test case catalog in <prior_output> define
WHAT to test. Your job is to define HOW — as executable Playwright code
with proper architecture. The QA team will extend this skeleton, so
patterns and conventions matter more than covering every single test case.
</context>

<operating_constraints>
- Use Playwright with TypeScript.
- Use Page Object Model pattern.
- All selectors use data-testid attributes (assume they exist).
- Include proper waits — no arbitrary timeouts (use waitForURL, waitForSelector).
- Include viewport switching for responsive tests.
- Include keyboard navigation tests (Tab, Arrow, Enter, Escape).
- Include axe-core integration for a11y checks.
- Demonstrate permission-based visibility testing (mock auth state).
- All code must be syntactically valid TypeScript.
- Include JSDoc comments explaining the pattern each test demonstrates.
</operating_constraints>

<task_instructions>
1. **E2E User Flow Map**
   Define 4–6 end-to-end user journeys that traverse multiple navigation
   levels. For each flow:
   - Flow name and description
   - Steps with navigation level transitions marked
   - Role/permission variants (if applicable)
   - What makes this flow high-risk or high-value

2. **Automation Blueprint — File Structure**
   ```
   tests/
   ├── e2e/navigation/
   │   ├── primary-nav.spec.ts
   │   ├── secondary-nav.spec.ts
   │   ├── overlays.spec.ts
   │   ├── responsive.spec.ts
   │   ├── keyboard-nav.spec.ts
   │   └── permissions.spec.ts
   ├── page-objects/
   │   ├── PrimaryNav.ts
   │   ├── SecondaryNav.ts
   │   └── OverlayManager.ts
   ├── fixtures/
   │   ├── auth.fixture.ts
   │   └── nav.fixture.ts
   └── utils/
       ├── a11y.ts
       └── viewport.ts
   ```

3. **Representative Test Implementations (8–10)**
   Write COMPLETE, RUNNABLE test files demonstrating these patterns:
   a. Route assertion after navigation click
   b. Active state assertion (aria-current)
   c. Keyboard navigation (Tab order through nav items)
   d. Arrow key navigation within a nav group
   e. Escape key closes overlay + focus returns
   f. Responsive: nav collapses at mobile viewport
   g. Permission: admin-only item hidden for viewer role
   h. A11y: axe scan on navigation landmark
   i. Badge count updates after action
   j. Deep link maintains correct active states

   Each implementation must include:
   - Import statements
   - Test setup/teardown
   - Assertions with error messages
   - Comments explaining the PATTERN (not just the test)
</task_instructions>

<output_format>
- ## E2E USER FLOW MAP — numbered flows with step-by-step
- ## FILE STRUCTURE — tree diagram
- ## PAGE OBJECTS — complete TypeScript files in fenced code blocks
- ## FIXTURES — complete TypeScript files
- ## TEST IMPLEMENTATIONS — each in its own fenced block with filename comment
</output_format>

<examples>
<example name="page_object">
```typescript
// page-objects/PrimaryNav.ts
import { type Page, type Locator } from '@playwright/test';

export class PrimaryNav {
  readonly page: Page;
  readonly logo: Locator;
  readonly navItems: Locator;
  readonly collapseToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByTestId('nav-logo');
    this.navItems = page.getByTestId('primary-nav').getByRole('link');
    this.collapseToggle = page.getByTestId('nav-collapse-toggle');
  }

  async navigateTo(itemName: string) {
    await this.page.getByTestId(`nav-item-${itemName.toLowerCase()}`).click();
    await this.page.waitForURL(`**/${itemName.toLowerCase()}*`);
  }

  async getActiveItem(): Promise<string | null> {
    const active = this.page.locator('[aria-current="page"]');
    return active.getAttribute('data-nav-label');
  }
}
```
</example>

<example name="test_implementation">
```typescript
// tests/e2e/navigation/primary-nav.spec.ts
import { test, expect } from '@playwright/test';
import { PrimaryNav } from '../page-objects/PrimaryNav';

/**
 * Pattern: Route assertion after navigation click.
 * Validates that clicking a nav item updates the URL and active state.
 * Maps to: REQ-L1-001, REQ-L1-002
 */
test('logo click navigates to dashboard', async ({ page }) => {
  await page.goto('/templates');
  const nav = new PrimaryNav(page);

  await nav.logo.click();

  await expect(page).toHaveURL('/dashboard');
  await expect(
    page.getByTestId('nav-item-dashboard')
  ).toHaveAttribute('aria-current', 'page');
});
```
</example>
</examples>

<verification>
After completing all code:
1. Every test references at least one RequirementID from Prompt 2 in its JSDoc.
2. All 10 patterns (a–j) are demonstrated.
3. All page objects are used by at least one test.
4. No test uses hardcoded timeouts (page.waitForTimeout is banned).
</verification>
```

---

## Prompt 4 of 4 — Quality Gates + Traceability Report

**Goal:** Define CI gating criteria and prove full requirement coverage.  
**Expected output:** ~2K–3K tokens. Configuration + coverage matrix.  
**Dependency:** Requires output from all prior prompts.

```xml
<prior_output>
  <!-- PASTE KEY SECTIONS FROM PROMPTS 1-3 HERE:
       - Requirements Matrix (from Prompt 2)
       - Test Case Catalog IDs (from Prompt 2)
       - Test file names (from Prompt 3) -->
</prior_output>

<inputs>
  <!-- PASTE YOUR FILLED-IN INPUTS BLOCK HERE -->
</inputs>

<system_role>
You are a DevOps/QA lead defining CI quality gates and producing a
traceability report for a navigation test suite.
</system_role>

<context>
The test suite defined in prior prompts needs CI integration with clear
pass/fail criteria, escalation paths for failures, and proof that every
requirement is covered. This is the final deliverable that makes the
spec auditable and actionable.
</context>

<operating_constraints>
- CI pipeline assumes: GitHub Actions or similar.
- Quality gates must be ordered by execution speed (fast → slow).
- Define explicit pass/fail thresholds (not "tests should pass").
- Include rollback/escalation protocol for each gate failure.
- Traceability must be a complete matrix — no gaps allowed.
  If gaps exist, flag them explicitly as UNCOVERED.
</operating_constraints>

<task_instructions>
1. **CI Quality Gates** (ordered by execution speed)
   For each gate, provide:
   - Gate name
   - What runs (tool + command)
   - Pass criteria (specific threshold)
   - Fail action (block deploy? notify? escalate?)
   - Estimated duration

   Gates to include:
   a. Lint + TypeCheck
   b. Unit Tests (navigation components)
   c. Integration Tests (navigation + routing)
   d. A11y Checks (axe-core)
   e. E2E Smoke Suite (critical paths only)
   f. E2E Full Suite (all test cases)
   g. Visual Regression (baseline comparison)
   h. Performance Smoke (navigation transition timing)

2. **Failure Escalation Matrix**
   | Gate | Failure Severity | Action | Owner | SLA |
   Define who gets paged and what happens for each gate failure.

3. **Traceability Report**
   Complete matrix proving every requirement is covered:
   | RequirementID | Description | TestCaseIDs | TestFile | Status |

   Status values: COVERED | PARTIAL | UNCOVERED
   - COVERED: ≥1 automated test exists and is mapped
   - PARTIAL: Test exists but doesn't cover all assertions
   - UNCOVERED: No test exists — flag for immediate action

4. **Definition of Done for Navigation Testing**
   Checklist that must be true before any navigation change ships:
   - All quality gates pass
   - Traceability report shows 0 UNCOVERED
   - Visual regression baseline approved
   - A11y scan returns 0 critical/serious violations
   - Keyboard navigation tested for new/changed elements
   - Responsive behavior verified at 3 breakpoints
</task_instructions>

<output_format>
- ## CI QUALITY GATES — table with all columns specified above
- ## FAILURE ESCALATION MATRIX — table
- ## TRACEABILITY REPORT — complete matrix table
- ## DEFINITION OF DONE — numbered checklist
- ## GAPS / RECOMMENDATIONS — anything that couldn't be fully resolved
</output_format>

<examples>
<example name="quality_gate_row">
| Gate | Runs | Pass Criteria | Fail Action | Duration |
|------|------|---------------|-------------|----------|
| Lint + TypeCheck | `npx tsc --noEmit && npx eslint .` | 0 errors | Block merge | ~30s |
| Unit Tests | `npx jest --testPathPattern=navigation` | 100% pass, ≥80% coverage | Block merge | ~45s |
| A11y Checks | `npx playwright test --grep @a11y` | 0 critical/serious axe violations | Block merge | ~60s |
| E2E Smoke | `npx playwright test --grep @smoke` | 100% pass | Block deploy | ~2min |
| Visual Regression | `npx playwright test --grep @visual --update-snapshots=none` | 0 pixel diff above threshold (0.1%) | Review required | ~3min |
</example>

<example name="traceability_row">
| REQ-L1-001 | Logo navigates to /dashboard | NAV-P1-001 | primary-nav.spec.ts | COVERED |
| REQ-L1-003 | Role-based nav visibility | NAV-P1-010, NAV-P1-011 | permissions.spec.ts | COVERED |
| REQ-L3-005 | Tab focus order in tertiary nav | — | — | UNCOVERED |
</example>
</examples>

<verification>
After completing all sections:
1. Every RequirementID from Prompt 2 appears in the Traceability Report.
2. Every UNCOVERED item has a note in GAPS / RECOMMENDATIONS.
3. Quality gates are ordered fastest → slowest.
4. Definition of Done has no ambiguous criteria.
</verification>
```

---

## Execution Checklist

| Step | Action | Output |
|------|--------|--------|
| 0 | Fill in `<inputs>` block with real project data | Completed inputs XML |
| 1 | Run Prompt 1 | Component Inventory + Information Model |
| 2 | Paste Prompt 1 output into Prompt 2's `<prior_output>` → Run | Requirements Matrix + Test Catalog |
| 3 | Paste Prompts 1+2 output into Prompt 3's `<prior_output>` → Run | E2E Flows + Playwright Code |
| 4 | Paste key sections from 1-3 into Prompt 4's `<prior_output>` → Run | Quality Gates + Traceability |
| 5 | Combine all outputs into single spec document | Complete Navigation QA Spec |

---

## Design Decisions (Why This Structure)

**Why 4 prompts instead of 1?**  
Claude 4.x models produce shallow output when overloaded. Each prompt targets ~3K–5K tokens of focused output vs. ~12K tokens of diluted output from a single prompt. Net result: 2–3x deeper coverage per section.

**Why XML tags everywhere?**  
Anthropic's official docs (2025–2026) confirm XML tags reduce misinterpretation when prompts mix instructions, context, examples, and variable inputs. Each tag creates an unambiguous boundary.

**Why examples in every prompt?**  
Few-shot examples are the single most reliable technique for steering output format and depth. 3–5 examples per prompt is Anthropic's recommendation. Each prompt includes 1–2 golden examples that anchor the expected format.

**Why `<verification>` blocks?**  
Self-check instructions catch structural gaps before you see the output. Claude will surface "UNCOVERED" traceability gaps rather than silently omitting them.

**Why inputs at the top?**  
Anthropic testing shows queries-at-bottom / data-at-top improves response quality by up to 30% for complex, multi-document inputs.

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

**Claim:** Chaining 4 prompts produces better output than 1 mega-prompt.  
**Evidence:** Claude 4.x literal execution model + context window fill patterns. At ~12K output tokens, later sections degrade.  
**Counterexample:** If your target app has only 2 navigation levels and ~10 test cases, a single prompt would suffice.

**Claim:** XML tags outperform Markdown headers for structural boundaries.  
**Evidence:** Anthropic official docs explicitly recommend XML tags for mixed-content prompts.  
**Counterexample:** For simple prompts (<500 tokens), XML adds overhead without benefit.

**Claim:** Page Object Model is the right pattern for these tests.  
**Evidence:** Industry standard for Playwright test organization, recommended in Playwright docs.  
**Counterexample:** For <10 test cases, inline selectors may be simpler and more maintainable.

**Gap:** The prompts assume `data-testid` attributes exist on all navigation elements. If the app doesn't have these, a selector strategy prompt should precede this chain.
