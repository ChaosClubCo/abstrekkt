# Kyle Rosebrook — Personal Portfolio

Dark + cool cinematic portfolio. Next.js 14 · TypeScript · Tailwind CSS.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS custom properties
- **Fonts**: Syne (display) · Space Mono (mono) · DM Sans (body) via Google Fonts
- **Animations**: CSS keyframes + Intersection Observer (zero JS animation lib dependencies)
- **Deploy**: Vercel (zero config)

## Setup

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

```bash
npx vercel --prod
```

Or push to GitHub and connect repo at vercel.com — zero config needed with Next.js.

## Customization

### Colors (`app/globals.css` → `:root`)
```css
--cyan: #00c8f0;       /* primary accent */
--void: #040a12;       /* background */
--surface: #081422;    /* card surface */
```

### Content
All content lives in the component files under `components/`:
- **Hero.tsx** — name, tagline, role
- **sections.tsx** → `About` — bio, stats, skills
- **sections.tsx** → `Work` — projects array at top of file
- **sections.tsx** → `Writing` — newsletter editions array
- **sections.tsx** → `Contact` — email, social links

### Email
Update `kyle@krosebrook.com` in `Contact` component to your real address.

## Structure

```
kyle-portfolio/
├── app/
│   ├── globals.css        # Design tokens, base styles, reveal animation
│   ├── layout.tsx         # Root layout + metadata
│   └── page.tsx           # Page composition
├── components/
│   ├── Cursor.tsx         # Custom cursor (client component)
│   ├── Hero.tsx           # Hero section
│   ├── Nav.tsx            # Sticky nav with scroll-aware styling
│   ├── sections.tsx       # About, Work, Writing, Contact, Footer
│   └── index.ts           # Barrel export
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

## Performance notes

- No external animation libraries (GSAP, Framer Motion, etc.) — pure CSS + Intersection Observer
- Custom cursor uses `requestAnimationFrame` with lerp — lightweight
- All fonts loaded via `next/font` compatible Google Fonts link in `globals.css`
- Orb backgrounds are CSS `radial-gradient` with `filter: blur` — GPU composited
- Noise overlay is inline SVG data URL — zero network requests
