# ProjectX Setup Guide

Quick setup guide for new developers.

---

## Prerequisites

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | >= 20.0.0 | `node --version` |
| npm | >= 10.0.0 | `npm --version` |
| Git | Any recent | `git --version` |

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd ProjectX

# 2. Copy environment file
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open in browser
# http://localhost:5173
```

---

## Environment Configuration

### Required Variables (Minimum for Development)

```env
# Application
NODE_ENV=development
VITE_APP_NAME=ProjectX
VITE_APP_URL=http://localhost:5173

# API (stub/mock for now)
VITE_API_URL=http://localhost:3001
```

### Optional Variables (For Full Features)

| Variable | Purpose | Module |
|----------|---------|--------|
| `VITE_AUTH_DOMAIN` | Auth provider | auth_module |
| `VITE_AUTH_CLIENT_ID` | Auth client ID | auth_module |
| `DATABASE_URL` | PostgreSQL connection | Backend |
| `REDIS_URL` | Caching/jobs | caching_layer, background_jobs |
| `SENDGRID_API_KEY` | Email sending | email_templates |
| `STRIPE_SECRET_KEY` | Payments | billing_management |
| `SENTRY_DSN` | Error tracking | monitoring_dashboard |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Fix code style issues |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Check TypeScript types |
| `npm run generate:module` | Create new module |

---

## Project Structure

```
ProjectX/
├── .claude/              # Claude Code config
├── .env                  # Local environment (gitignored)
├── .env.example          # Environment template
├── node_modules/         # Dependencies
├── packages/
│   └── shared/           # Shared components
├── src/
│   ├── App.tsx           # Module gallery
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── [50 module folders]/  # Feature modules
├── package.json          # Root package
├── tailwind.config.js    # Tailwind config
├── tsconfig.json         # TypeScript config
└── vite.config.ts        # Vite config
```

---

## Module Development

### Creating a New Module

```bash
npm run generate:module my_new_module
```

This creates:
```
my_new_module/
├── README.md
├── package.json
└── src/
    ├── index.ts
    ├── components/
    │   └── MyNewModule.tsx
    ├── hooks/
    │   └── useMyNewModule.ts
    └── types/
        └── index.ts
```

### Module Conventions

1. **Naming**: Use snake_case for folder names
2. **Exports**: All public APIs via `src/index.ts`
3. **Components**: PascalCase component names
4. **Hooks**: camelCase with `use` prefix
5. **Types**: Colocated in `types/` folder

---

## IDE Setup

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Troubleshooting

### Common Issues

**Port 5173 already in use:**
```bash
# Find and kill the process
npx kill-port 5173
# Or use a different port
npm run dev -- --port 3000
```

**Node version mismatch:**
```bash
# Use nvm to switch versions
nvm install 20
nvm use 20
```

**Dependencies not installing:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**TypeScript errors after changes:**
```bash
# Restart TS server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## Security Notes

Before committing:
1. Never commit `.env` files
2. Review `SECURITY_REVIEW_REQUIRED.md`
3. Run `npm audit` to check vulnerabilities
4. Ensure no secrets in code

---

## Next Steps

1. Read [DEVELOPER_HANDOFF.md](./DEVELOPER_HANDOFF.md)
2. Review [MODULE_STATUS.md](./MODULE_STATUS.md)
3. Check [CHANGELOG.md](./CHANGELOG.md)
4. Explore the module gallery at `http://localhost:5173`

---

*Last updated: January 18, 2026*
