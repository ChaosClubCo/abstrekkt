# ProjectX

A comprehensive SaaS platform skeleton built with React and TypeScript, featuring **50 modular components** for rapid application development.

## Current Status (January 18, 2026)

| Metric | Value |
|--------|-------|
| Total Modules | 50 |
| Complete (src + plan) | 27 (54%) |
| Partial (src only) | 22 (44%) |
| Stub (docs only) | 1 (2%) |

> **App shell:** `src/main.tsx` + `src/App.tsx` now compose the wired modules into a
> runnable app (`npm run dev` → http://localhost:5173). Currently wired: `auth_module`
> (`/login`), `analytics_dashboard` (`/analytics`), `dark_mode` (theme toggle).

**New Developer?** Start here:
- [SETUP.md](./SETUP.md) - Environment setup guide
- [DEVELOPER_HANDOFF.md](./DEVELOPER_HANDOFF.md) - Full project context
- [MODULE_STATUS.md](./MODULE_STATUS.md) - Implementation status (50 modules)
- [CHANGELOG.md](./CHANGELOG.md) - Development history

**Technical Documentation:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture & patterns
- [CONVENTIONS.md](./CONVENTIONS.md) - Coding standards
- [TESTING.md](./TESTING.md) - Test coverage & guidelines
- [BACKLOG.md](./BACKLOG.md) - Prioritized work items
- [RESOURCES.md](./RESOURCES.md) - External reference materials

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

ProjectX follows a modular architecture where each feature is self-contained with
its own components, hooks, and utilities.

```
ProjectX/
├── src/                  # App shell (main.tsx, App.tsx) — composes wired modules
├── <module>/             # Feature modules are FLAT top-level dirs (auth_module/, …)
│   └── src/{components,hooks,api,types,__tests__}
├── docs/                 # Architecture / conventions / status (verify vs configs)
├── package.json
└── README.md
```

> **Note:** the `package.json` `workspaces` globs (`packages/*`, `modules/*`) point at
> directories that are currently empty — the real module code lives in the flat
> top-level dirs above. The `@projectx/shared` package referenced throughout the docs
> has not been created yet, so its import alias does not resolve.

## Modules

### Core Platform

| Module | Description |
|--------|-------------|
| `auth_module` | Sign-up, sign-in, sign-out, password reset flows |
| `project_dashboard` | Main dashboard UI with widgets and metrics |
| `user_settings` | User preferences and profile management |
| `team_management` | Team member invitations and management |
| `roles_management` | Role-based access control (RBAC) |
| `billing_management` | Subscription plans (Free/Pro/Enterprise) |
| `onboarding_assistant` | User onboarding and setup wizards |

### AI & Intelligence

| Module | Description |
|--------|-------------|
| `AIAgents` | AI agent workflows (MCP, LangChain, CrewAI) |
| `ai_builder_demo` | Visual AI workflow builder |
| `ai_finetuning` | Model fine-tuning interface |
| `ai_tools_marketplace` | AI tools discovery and integration |

### Analytics & Monitoring

| Module | Description |
|--------|-------------|
| `analytics_dashboard` | Basic analytics and metrics |
| `advanced_analytics` | Advanced reporting and insights |
| `monitoring_dashboard` | System health and performance monitoring |

### Communication

| Module | Description |
|--------|-------------|
| `notifications_module` | In-app and push notifications |
| `realtime_chat_support` | Live chat support widget |
| `feedback_system` | User feedback collection |

### Operations & DevOps

| Module | Description |
|--------|-------------|
| `ci_cd_setup` | CI/CD pipeline configuration |
| `secrets_management` | Secrets vault integration |
| `testing_interface` | Testing tools and utilities |

### Content & Commerce

| Module | Description |
|--------|-------------|
| `support_docs` | Documentation and help center |
| `template_marketplace` | Template store and gallery |
| `commerce_demo` | E-commerce functionality |
| `publish_demo` | Publishing workflows |

### Enterprise Features

| Module | Description |
|--------|-------------|
| `compliance_privacy` | GDPR/CCPA compliance tools |
| `custom_domain_ssl` | Custom domain and SSL management |
| `localization_support` | Internationalization (i18n/l10n) |
| `integrations_manager` | Third-party integrations hub |

### Data

| Module | Description |
|--------|-------------|
| `comprehensive_search` | Full-text search functionality |
| `data_import_export` | Data portability tools |

### Infrastructure

| Module | Description |
|--------|-------------|
| `multi_tenancy` | Workspace isolation and tenant management |
| `audit_logging` | Activity trail for compliance |
| `two_factor_auth` | 2FA/MFA authentication |
| `email_templates` | Transactional email system |
| `webhook_manager` | Webhook configuration and delivery |
| `feature_flags` | Feature flag management |
| `api_documentation` | OpenAPI/Swagger documentation |
| `background_jobs` | Job queue management |
| `session_management` | View and revoke active sessions |
| `api_rate_limiting` | Protect APIs from abuse |
| `file_management` | Upload, storage, CDN integration |
| `caching_layer` | Redis/memory caching |
| `health_status` | System health monitoring |
| `usage_pricing` | Usage-based billing metrics |
| `sso_saml` | SSO/SAML authentication |
| `ip_whitelisting` | IP-based access control |

### UI/UX

| Module | Description |
|--------|-------------|
| `dark_mode` | Theme switching and dark mode |
| `keyboard_shortcuts` | Command palette and shortcuts |
| `pwa_mobile` | Progressive web app support |
| `white_label` | Custom branding and theming |

## Tech Stack

- **Frontend:** React 19, TypeScript 5 (strict), Tailwind CSS v4 (via `@tailwindcss/vite` — no `tailwind.config.js`)
- **Build/Dev:** Vite 6
- **Test:** Vitest 3 (jsdom), 80% coverage thresholds
- **Lint/Format:** ESLint 9 (flat config, `eslint.config.js`) + Prettier
- **State:** Zustand (client) / TanStack React Query (server)
- **Routing:** React Router 7
- **API:** REST (axios) — dev server proxies `/api` → `localhost:3001`
- **Auth:** JWT, OAuth 2.0, SAML ready
- **Database:** PostgreSQL / Supabase compatible
- **Deployment:** Vercel / AWS / Docker

## Development

### Module Structure

Each module follows a consistent structure:

```
module_name/
├── components/       # React components
├── hooks/            # Custom hooks
├── utils/            # Utility functions
├── types/            # TypeScript types
├── api/              # API calls
├── index.ts          # Module exports
└── README.md         # Module documentation
```

### Adding a New Module

> ⚠️ `npm run generate:module` is currently **broken** — `scripts/generate-module.js`
> does not exist. Until it is restored, create a module by copying an existing
> module's `src/` layout. Remember to also register the new module's globs in
> `tsconfig.json` (`include`) and `vitest.config.ts` (`include`).

### Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific module (pass a path/name substring — there is no --scope flag)
npm test -- auth_module
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# API
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Auth
VITE_AUTH_DOMAIN=your-auth-domain
VITE_AUTH_CLIENT_ID=your-client-id

# Features
VITE_ENABLE_AI=true
VITE_ENABLE_ANALYTICS=true
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

Proprietary - All rights reserved.
