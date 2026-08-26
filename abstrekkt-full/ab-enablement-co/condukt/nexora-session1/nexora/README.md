# Nexora — The AI Business Engine

All-in-one business platform for Coaches, Creators & Entrepreneurs.

## Quick Start

```bash
npm install --legacy-peer-deps
npm run dev
```

## One-Command Vercel Deploy

```bash
npx vercel --yes
```

Or connect to GitHub and push — Vercel auto-deploys.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** Tailwind CSS + Radix UI + CVA
- **Backend:** Supabase (Auth + Database)
- **Animations:** Framer Motion
- **Validation:** Zod
- **Deploy:** Vercel

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/page.tsx         # Login/Register
│   └── dashboard/
│       ├── layout.tsx        # Sidebar + Topbar
│       ├── page.tsx          # Dashboard home
│       ├── contacts/         # CRM Contacts
│       ├── pipeline/         # Visual Pipeline
│       ├── deals/            # Deal Tracking
│       ├── calendar/         # Booking & Calendar
│       ├── email/            # Email Integration
│       ├── inbox/            # Nexus AI Agent
│       ├── todos/            # Task Management
│       ├── automations/      # Workflow Builder
│       ├── community/        # Community Hub
│       ├── learning/         # Course Platform
│       ├── products/         # Product Catalog
│       ├── proposals/        # Proposals & Invoices
│       ├── reviews/          # Testimonials
│       ├── profile-tree/     # Link-in-Bio
│       ├── page-tree/        # Landing Pages
│       ├── social-inbox/     # Social Messages
│       ├── reports/          # Analytics
│       ├── goals/            # Goal Tracking
│       ├── settings/         # Account Settings
│       ├── subscription/     # Billing
│       ├── admin/            # Admin Panel
│       └── help/             # Help Center
├── components/
│   ├── ui/                   # Design system
│   ├── landing/              # Landing page sections
│   ├── dashboard/            # Dashboard components
│   └── shared/               # Shared components
├── lib/utils.ts              # Utilities + constants
├── styles/globals.css        # Design tokens + CSS
└── types/                    # TypeScript types
```

## Session Build Plan

| Session | Deliverable | Status |
|---------|------------|--------|
| 1 ✅ | Scaffolding + Design System + Landing + Auth + Dashboard Shell + All 25 Routes | Done |
| 2 | CRM Module (Contacts, Pipeline, Deals) + Calendar/Booking | Next |
| 3 | AI Agent Chat + Email Integration UI | Planned |
| 4 | Community + Learning/Courses | Planned |
| 5 | Automations Builder + Social Inbox | Planned |
| 6 | ProfileTree + PageTree + Products + Proposals | Planned |
| 7 | Admin Panel + Settings + Billing + Gamification | Planned |
| 8 | Security Hardening + Testing + Performance + Final Deploy | Planned |
