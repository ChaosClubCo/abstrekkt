# Development Best Practices - INT Inc. Project

## 1. Code Style & Standards
- **TypeScript**: Use strict typing. Avoid `any`. Define interfaces in `types.ts` for shared data structures.
- **Functional Components**: Use React functional components with hooks (`useState`, `useEffect`, `useMemo`).
- **Naming Conventions**: 
    - Components: PascalCase (e.g., `QuantumScene.tsx`)
    - Utilities/Hooks: camelCase (e.g., `useScroll.ts`)
    - Constants: UPPER_SNAKE_CASE

## 2. Styling (Tailwind CSS)
- **Utility First**: Prefer Tailwind classes over custom CSS.
- **Consistency**: Use the established brand colors:
    - `int-navy`: Primary brand color.
    - `int-gold`: Accent/CTA color.
    - `int-teal`: Secondary accent.
    - `int-cream`: Background/Neutral.
- **Responsive Design**: Always use mobile-first prefixes (`md:`, `lg:`) to ensure layout integrity across devices.

## 3. Component Organization
- **Atomic Design**: Keep components small and focused. Reusable UI elements should live in `src/components/ui/` (if using shadcn) or `src/components/`.
- **Prop Types**: Always define interfaces for component props.

## 4. Performance
- **Image Optimization**: Use appropriate formats and sizes. Include `referrerPolicy="no-referrer"` for external assets.
- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` for expensive computations or to prevent unnecessary re-renders in complex components (like R3F scenes).

## 5. Accessibility (a11y)
- **Semantic HTML**: Use `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>` appropriately.
- **ARIA Labels**: Provide `aria-label` for icon-only buttons or interactive elements.
- **Alt Text**: Ensure all images have descriptive `alt` attributes.

## 6. Git & Version Control
- **Commit Messages**: Use descriptive, imperative messages (e.g., "Add Case Study carousel to About page").
- **Branching**: Use feature branches (e.g., `feature/about-page-updates`).

## 7. Documentation
- **Inline Comments**: Document complex logic or non-obvious workarounds.
- **Markdown**: Keep `docs/` updated with any major architectural or requirement changes.
