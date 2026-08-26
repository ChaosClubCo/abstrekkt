# ProjectX Quick Start Guide

Get your SaaS application running in under 5 minutes.

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+ or **pnpm** 8+
- **Git** 2.40+
- **Supabase account** (free tier works)
- **Stripe account** (test mode for development)

---

## 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/projectx.git
cd projectx

# Install dependencies
npm install

# Or with pnpm (faster)
pnpm install
```

---

## 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Supabase (get from supabase.com/dashboard)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (get from dashboard.stripe.com)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001
```

---

## 3. Database Setup

```bash
# Run Supabase migrations
npx supabase db push

# Or apply migrations manually
npx supabase migration up
```

---

## 4. Start Development

```bash
# Start the development server
npm run dev
```

Your app is now running at **http://localhost:5173** 🎉

---

## 5. First Steps

### Create an Admin Account

1. Navigate to http://localhost:5173/register
2. Create your first account
3. This account becomes the super admin

### Configure Your Tenant

1. Go to **Settings → Organization**
2. Set your company name and branding
3. Configure your billing plans in **Billing → Plans**

### Enable Modules

ProjectX uses feature flags to enable/disable modules:

```typescript
// In your .env or feature_flags config
VITE_ENABLED_MODULES=auth,billing,analytics,team_management
```

Or toggle via the admin dashboard at `/admin/modules`.

---

## Project Structure

```
projectx/
├── src/                    # Main application source
│   ├── components/         # Shared UI components
│   ├── hooks/              # Shared React hooks
│   ├── lib/                # Utilities and configs
│   └── pages/              # Route pages
├── auth_module/            # Authentication module
├── billing_management/     # Billing & subscriptions
├── team_management/        # Team features
├── [other_modules]/        # 50+ feature modules
├── design_templates/       # Design system templates
├── docs/                   # Documentation
│   ├── MODULE_CATALOG.md   # All modules reference
│   └── migration-guides/   # Migration documentation
└── packages/               # Shared packages
    └── shared/             # Shared utilities
```

---

## Common Commands

```bash
# Development
npm run dev           # Start dev server (port 5173)
npm run dev:api       # Start API server (port 3001)

# Testing
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint          # Run ESLint
npm run typecheck     # Run TypeScript checks
npm run format        # Format with Prettier

# Building
npm run build         # Production build
npm run preview       # Preview production build

# Database
npm run db:push       # Push schema changes
npm run db:migrate    # Run migrations
npm run db:seed       # Seed demo data
```

---

## Module Quick Enable

### Authentication (Required)
```typescript
// Already enabled by default
import { AuthProvider } from '@/auth_module';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

### Billing
```typescript
import { BillingProvider, PricingTable } from '@/billing_management';

// Add to your pricing page
<PricingTable
  plans={['starter', 'pro', 'enterprise']}
  onSelectPlan={(plan) => handleCheckout(plan)}
/>
```

### Analytics
```typescript
import { AnalyticsProvider, useAnalytics } from '@/analytics_dashboard';

// Track events
const { track } = useAnalytics();
track('button_clicked', { buttonId: 'signup' });
```

### Feature Flags
```typescript
import { useFeatureFlag } from '@/feature_flags';

function MyComponent() {
  const isNewUIEnabled = useFeatureFlag('new_dashboard_ui');

  return isNewUIEnabled ? <NewDashboard /> : <OldDashboard />;
}
```

---

## Choosing a Design Template

ProjectX includes 5 design templates in `/design_templates/`:

| Template | Best For |
|----------|----------|
| `01-intinc-main.html` | INT Inc brand consistency |
| `02-professional-trustworthy.html` | Enterprise B2B products |
| `03-modern-technical.html` | Developer tools & APIs |
| `04-warm-approachable.html` | Consumer apps, communities |
| `05-bold-distinctive.html` | Startups, innovative products |

Apply a template's colors to your Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Copy from your chosen template
        primary: '#5490a9',
        secondary: '#33475b',
        accent: '#b9590e',
      }
    }
  }
}
```

---

## Environment Configurations

### Development
- Hot reload enabled
- Debug logging
- Mock data available
- Stripe test mode

### Staging
```env
NODE_ENV=staging
VITE_APP_URL=https://staging.yourapp.com
```

### Production
```env
NODE_ENV=production
VITE_APP_URL=https://yourapp.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
npx kill-port 5173
```

### Database connection failed
1. Check your Supabase URL in `.env`
2. Verify your anon key is correct
3. Ensure your IP is allowed in Supabase dashboard

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules .vite
npm install
```

### TypeScript errors
```bash
# Check for type issues
npm run typecheck

# Generate types from database
npx supabase gen types typescript --local > src/types/database.types.ts
```

---

## Next Steps

1. 📖 Read the [Module Catalog](./MODULE_CATALOG.md) to understand available features
2. 🎨 Choose a [Design Template](../design_templates/) for your brand
3. 🔐 Configure [Authentication](../auth_module/README.md) providers
4. 💳 Set up [Billing](../billing_management/README.md) plans
5. 🚀 Deploy using the [Migration Guides](./migration-guides/)

---

## Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: GitHub Issues
- **Community**: Discord server
- **Enterprise Support**: support@intinc.com

---

*Happy building! 🚀*
