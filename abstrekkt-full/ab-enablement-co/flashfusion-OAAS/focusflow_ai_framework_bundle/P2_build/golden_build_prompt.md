# FOCUSFLOW AI – GOLDEN BUILD PROMPT (Project Seed -> Deployable Repo)
role: Senior Full-Stack Engineer
input:
  previous_output: <paste ideaSchema JSON for the selected idea>
goal: Generate a ready-to-deploy Lovable.dev / Vercel project bundle
context:
  frontend: Next.js 14 (App Router) + Tailwind + shadcn/ui + Recharts
  backend: Supabase (Postgres + Auth + Storage + Edge Functions)
  ai: OpenAI GPT-4o-mini
  payments: Stripe Checkout + webhook
requirements:
  include_files:
    - app/(marketing)/page.tsx
    - app/(app)/dashboard/page.tsx
    - app/layout.tsx
    - app/api/ai/summarize/route.ts
    - app/api/stripe/checkout/route.ts
    - app/api/stripe/webhook/route.ts
    - components/ui/Button.tsx
    - components/TaskList.tsx
    - components/ProBadge.tsx
    - components/UpgradeModal.tsx
    - components/UsageMeter.tsx
    - lib/supabaseClient.ts
    - lib/otel.ts
    - lib/auth.ts
    - supabase/schema.sql
    - supabase/policies.sql
    - supabase/functions/reset-usage/index.ts
    - supabase/functions/weekly-digest/index.ts
    - .env.example
    - README_MVP.md
    - vercel.json
    - package.json
validation:
  - Validate ideaSchema
  - Type-check imports resolve
  - blindspot_audit: accessibility/security/billing failsafes
outputs:
  - lovable_project_seeds.json
  - lovable_seed_bundle.zip
