# Abstrekkt Design Contract

Status: CANONICAL
Scope: repository-wide default; product-specific design contracts may specialize but may not silently contradict these rules.

## Authority order

1. Runtime correctness and accessibility.
2. Semantic design tokens.
3. Explicit component state machines.
4. Responsive behavior and reduced-motion coverage.
5. Product-specific brand contract.
6. Visual decoration.

When a lower rule conflicts with a higher rule, the higher rule wins.

## Required inputs for design work

Every design-generation task must identify:

- target surface and user goal;
- active product/brand contract;
- semantic token source;
- supported breakpoints;
- interaction states: default, hover, active, focus, disabled, plus loading/error when applicable;
- accessibility constraints;
- reference artifacts and their provenance.

Open Design is the preferred design compiler. `SKILL.md` plugins are treated as portable capability packages, not as sources of product truth. Product truth remains in this repository.

## Output contract

Generated design work must produce or update an `ArtifactManifest/v1` containing hashes for every promoted artifact. Visual exploration is not implementation evidence. A design artifact becomes implementation input only after its source and manifest are preserved.

## Anti-slop gate

Reject generated UI that introduces any of the following without an explicit product requirement:

- raw colors where semantic tokens exist;
- arbitrary gradients, glow, blur, glass, oversized radii, or decorative animation;
- inaccessible contrast or missing focus treatment;
- hover-only interaction;
- unbounded animation or missing `prefers-reduced-motion` behavior;
- card grids used merely to make content look designed;
- placeholder metrics, fabricated social proof, or invented product claims;
- divergent implementations of a shared component state machine.

## Responsive floor

Design and implementation must be checked at representative mobile, tablet, and desktop widths. Layout must tolerate text expansion and zoom without clipping critical actions. Touch targets must be at least 44 by 44 CSS pixels unless a stricter product contract applies.

## Accessibility floor

WCAG 2.1 AA is the minimum unless a product contract specifies a newer/higher target. Keyboard navigation, visible focus, semantic headings, labels, error association, motion reduction, and contrast are release requirements, not polish.

## Existing product contracts

Existing specialized contracts such as `project/design.md` remain authoritative for their named surface. They inherit this file's runtime/accessibility/token rules and may override brand-specific aesthetics and component details.

## Codex / Open Design workflow

1. Read this file and the product-specific design contract.
2. Resolve semantic token sources before generating UI.
3. Use an Open Design skill/plugin appropriate to the task when available.
4. Generate artifacts as exploration first.
5. Implement through the repository's normal code path.
6. Verify lint, typecheck, tests, build, responsiveness, keyboard use, and reduced motion.
7. Hash promoted artifacts into `ArtifactManifest/v1`.
8. Do not claim completion without `ExecutionReceipt/v1` evidence.
