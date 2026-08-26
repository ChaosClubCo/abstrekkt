# Quick Start Guide

## Prerequisites

- Node.js 20+
- npm or yarn
- Git

## 5-Minute Setup

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest flashfusion-studio \
  --typescript \
  --tailwind \
  --app \
  --src-dir

cd flashfusion-studio
```

### Step 2: Copy Configuration Files

```bash
# From this package
cp ../studio-grade-webapp/config/tailwind.config.ts ./
cp ../studio-grade-webapp/config/middleware.ts ./src/
cp ../studio-grade-webapp/assets/design-tokens.json ./
cp ../studio-grade-webapp/.env.example ./.env.local
```

### Step 3: Install Dependencies

```bash
npm install @sanity/client @sanity/image-url next-sanity \
  next-intl @simplewebauthn/browser @simplewebauthn/server \
  @supabase/supabase-js class-variance-authority clsx zod

npm install -D @tailwindcss/forms @tailwindcss/typography \
  @tailwindcss/aspect-ratio @playwright/test pa11y-ci
```

### Step 4: Configure Environment

Edit `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 5: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Next Steps

1. **Review Documentation**
   - Read [INDEX.md](INDEX.md) for overview
   - Review [docs/SITEMAP_WIREFRAMES.md](docs/SITEMAP_WIREFRAMES.md)
   - Study [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md)

2. **Build First Component**
   ```tsx
   // src/components/Button.tsx
   import { clsx } from 'clsx';
   
   export function Button({ children, variant = 'primary' }) {
     return (
       <button
         className={clsx(
           'px-6 py-3 rounded-lg font-medium',
           variant === 'primary' && 'bg-brand-primary text-white',
           variant === 'secondary' && 'border border-brand-primary text-brand-primary'
         )}
       >
         {children}
       </button>
     );
   }
   ```

3. **Create First Page**
   ```tsx
   // src/app/page.tsx
   import { Button } from '@/components/Button';
   
   export default function HomePage() {
     return (
       <main>
         <h1>Welcome to FlashFusion Studio</h1>
         <Button variant="primary">Get Started</Button>
       </main>
     );
   }
   ```

4. **Set Up Sanity**
   ```bash
   npm create sanity@latest
   ```

5. **Run Tests**
   ```bash
   npm run lint
   npm run test
   npm run test:e2e
   ```

## Troubleshooting

### "Cannot find module 'next-intl'"
```bash
npm install
```

### "NEXT_PUBLIC_SANITY_PROJECT_ID is not defined"
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## Getting Help

1. Check [docs/GAP_ANALYSIS.md](docs/GAP_ANALYSIS.md) for known issues
2. Review [tests/test-plan.md](tests/test-plan.md) for testing guidance
3. See [deployment/DEPLOYMENT_CHECKLIST.md](deployment/DEPLOYMENT_CHECKLIST.md) before launch

---

**Ready to build? Start with Phase C (Foundation) in the full documentation!**
