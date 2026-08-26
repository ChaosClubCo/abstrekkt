# Changelog — Construction, Not Recovery · Source Map

All notable changes. Versions align with the manual (`Source Map Manual.html` §09).

## 1.4 — 2026-07-06
### Added
- `Source Map Manual.html` — comprehensive in-brand operator's manual
  (usage, data schema, machine layer, editorial rules, sensitive-material
  protocol, architecture, changelog).
- In-app help overlay (`? Manual` button) with quick reference + manual link.
- `abstrekkt/docs/README.md` and this changelog.

No behavior changes.

## 1.3 — 2026-07
### Fixed
- Edge clipping: bounds clamp now uses each node's true half-dimensions
  (positions are center-based).
- Short viewports: board is a scroll viewport around a min-height canvas —
  nodes scroll into reach instead of overlapping or clipping.
- Layout not running when the preview iframe was offscreen: warm-up moved to a
  synchronous pass in the render body; rAF is polish only.
- `compact` misreporting at desktop widths: `matchMedia` removed; compact now
  derives from the measured board width (single source of truth).
- Dead right margin: canvas width tracks the measured board width exactly
  (removed the 700px width floor); measurement moved to `useLayoutEffect`.

## 1.2 — 2026-07
### Added
- SPREAD control (0.6–2.4×) stretching the whole web.
- Document intake: upload / drag-drop / note → AI classification
  (`window.claude.complete`, feature-detected) → editable proposal →
  explicit commit. Manual filing fallback when AI is unavailable.
- Machine-filed threads render dashed (permanent provenance marker).

## 1.1 — 2026-07
### Changed
- Responsive pass: compact node sizing, viewport-aware layout, touch drag.

## 1.0 — 2026-07
### Added
- Initial board: 18 nodes, 29 reasoned relations, 6 categories, custom force
  layout, node/thread selection with reasons panel, brand-faithful rendering.
