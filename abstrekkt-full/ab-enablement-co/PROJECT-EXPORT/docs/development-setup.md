# Development Setup

## Prerequisites
Node.js 22+, pnpm 9+, Docker, Python 3.11+.

## Commands
```bash
pnpm install
docker compose -f infrastructure/docker-compose.yml up -d postgres redis
pnpm --filter @memoir/backend dev
pnpm --filter @memoir/frontend dev
python3 scripts/validate-export.py
```
