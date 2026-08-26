# Icon Policy: Studio Edition Visual Identity

## Overview
This document defines the visual identity standards for icons within *My Sticker Room: Studio Edition*. To maintain a high-fidelity, "Master Artisan" aesthetic, we prioritize original, domain-specific geometry over generic icon libraries.

## Approved Icon Usage
### 1. Utility Icons (The Exception)
Generic libraries (e.g., Lucide, Heroicons) are permitted **only** for small, functional UI actions:
- `close`, `search`, `menu`, `chevron`, `settings`, `upload`, `download`, `trash`, `external-link`, `back/forward`, `copy`, `edit`.
- These must be imported **exclusively** from `/components/icons/utility-icons.tsx`.

### 2. Custom Domain Icons (The Standard)
All other icons—brand marks, feature cards, product modules, empty states, and decorative visuals—must be hand-authored SVGs.
- **Location:** `/components/icons/custom-icons.tsx`
- **Registry:** Every icon must be registered in `/components/icons/icon-registry.tsx`.

## Disallowed Icon Usage
- **NO** direct imports from `lucide-react`, `@heroicons/react`, `react-icons`, or any other third-party library outside of the approved utility file.
- **NO** "SaaS Slop": Sparkles, wands, generic brains, robots, shields, rockets, or abstract "nodes" unless they have a specific, documented domain meaning.
- **NO** placeholder circles or unstyled emoji icons.

## Custom SVG Quality Bar
1. **Domain Fidelity:** Icons must reflect stationery, alchemy, botany, or cozy-living metaphors (e.g., a "Pulp Vat" instead of a "Database").
2. **Detail Density:** Every icon should include 2–4 meaningful internal details (texture lines, overlapping shapes, domain-specific hardware).
3. **Consistency:**
   - **viewBox:** Always `0 0 48 48`.
   - **Stroke:** Use design tokens (e.g., `primary`, `outline`).
   - **Colors:** Use `currentColor` for maximum flexibility.
4. **Accessibility:** 
   - Use `role="img"` and a `<title>` for meaningful icons.
   - Use `aria-hidden="true"` for purely decorative icons.

## Review Checklist
- [ ] Does this icon communicate a specific domain workflow?
- [ ] Is the geometry original (not a library copy)?
- [ ] Does it pass the ESLint "no-restricted-imports" check?
- [ ] Is it exported via the `AppIcon` registry?

## Codegen & AI Rules
- AI tools may be used to generate initial SVG paths, but they **must** be refined to match the Studio Edition design system tokens and geometric constraints before commit.