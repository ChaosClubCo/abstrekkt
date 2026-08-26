# FlashFusion Web — Context

**Last updated**: 2026-05-08  
**Status**: Active MVP build

## Architecture

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + custom design tokens (`components/tokens.ts`)
- **Language**: TypeScript (strict)
- **Build tools**: ESLint, PostCSS, `npm run typecheck`

### Directory layout

```
flashfusion-web/
├── app/                   # Next.js App Router
│   ├── docs/              # /docs route
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Shared UI components
│   ├── Hero.tsx
│   ├── Button.tsx
│   ├── Scene.tsx
│   ├── Stats.tsx
│   └── tokens.ts          # Design token definitions
└── next.config.mjs        # Next.js config
```

## Active branch

Check `git branch` — main branch is the working branch as of last session.

## Design system

- Custom design tokens defined in `components/tokens.ts`
- Tailwind config extended in `tailwind.config.ts`
- Global styles in `app/globals.css`
- FlashFusion brand profile: neon-glass dark mode, purple glow, Poppins + Inter

## Known issues / tech debt

- No auth implemented yet
- No backend / API routes yet — purely frontend MVP
- `Scene.tsx` may need performance review (likely 3D/animation component)
- `app/docs/` route content TBD

## Environment setup

```bash
# Install dependencies
npm install

# Dev server (localhost:3000)
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Production build
npm run build
```

No `.env` required for frontend-only MVP. When backend is added, document env vars here.

## Key decisions

- App Router over Pages Router — forward-looking, supports RSC when needed
- Tailwind over CSS-in-JS — faster iteration, design token layer in `tokens.ts`
- TypeScript strict mode — catch type errors early
- No state management library yet — local React state sufficient for MVP scope

## Related files

- `../docs/VISION.md` — Product vision
- `../docs/MVP_PITCH_PACK.md` — Pitch materials
- `../research/` — NotebookLM research exports
- `../prototypes/` — HTML proof-of-concept prototypes (pre-Next.js)
