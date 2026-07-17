## Phase 8.5 — Performance (BUILD mode only)

Skip this phase for SPEC mode. For BUILD mode, performance is a design decision
— not an afterthought bolted on after code review.

For full performance guidance, chain to `professional-web-design` skill. The
requirements below are the minimum bar for any BUILD output from this skill.

**Loading strategy:**
- Lazy-load images and heavy components below the fold (`loading="lazy"`,
  dynamic imports, `React.lazy` / `Suspense` or framework equivalent)
- Critical CSS inlined in `<head>`. Non-critical CSS deferred.
- Code-split by route. No single bundle over 200KB gzipped.
- Fonts: `font-display: swap` + preload the primary weight only.
  Load additional weights on demand.
- Prefetch likely next-navigation targets (`<link rel="prefetch">`)

**Caching strategy:**
- Static assets: immutable hashes in filenames, `Cache-Control: max-age=31536000`
- API responses: cache-aware headers (`ETag`, `If-None-Match`)
- For AI-native products: cache completed AI responses client-side where
  appropriate (same prompt + params = cached result). Never cache streaming
  partial responses.
- Service worker for offline shell (if applicable)

**Render performance:**
- No layout shift after initial paint (reserve space for async content)
- Animations on `transform` + `opacity` only (GPU-composited, no reflow)
- Virtualize long lists (>100 items). Do not render 500 DOM nodes.
- Debounce search inputs (300ms). Throttle scroll handlers (16ms).
- Images: `width` and `height` attributes set, WebP/AVIF with fallback

**Performance budget:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total blocking time: < 200ms
- Initial bundle: < 200KB gzipped (JS + CSS)

Measure after build. If any metric exceeds budget, it's a bug — not a tradeoff.

---

## Phase 9 — Anti-Slop Audit (required deliverable)

Read `references/anti-slop-checklist.md` for the full audit checklist.

Run all four tests. Document failures. Do not suppress them.

### Test 1: Template Test

"Could this have been produced by any AI tool with defaults?"
If YES → identify the element. Redesign it. Repeat.

### Test 2: Completeness Test

- Every component has all 8 states?
- Every screen has an empty state?
- Every error has a recovery action?
- Every animation has a purpose + reduced-motion fallback?
- Every color pairing contrast-checked and passed?
- Focus rings visible and styled?
- Touch targets ≥ 44px?
- No screen exists only because templates include it?

### Test 3: Memorability Test

(from `references/cinematic-design.md` Section 5)

> "If someone used this for 5 minutes and described it from memory,
> what would they say?"

- If the answer is "a clean app with a sidebar and some cards" — **FAIL**
- If the answer references a specific visual choice, interaction, or moment — **PASS**

Identify the single most memorable element. If it doesn't exist — design it.

### Test 4: Category Failure Analysis

Identify the 2 most common failure modes for this product type.
State specifically how this design avoids them.

### Refinement Priorities

Top 2 elements that would raise quality further — with direction.

---

## Quality Bar

This output should not embarrass a senior designer.
It will not compete with Linear or Figma. That is not the goal.

The goal: ship a prototype that has a real point of view, a defensible design
system, and zero obvious AI slop.

If it has any of those — find it, name it, fix it.
