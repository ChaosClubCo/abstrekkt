# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this directory is

`04_AI-Main-Projects/KAR` is a **workspace root**, not a single project. It holds four parallel subtrees — a mix of runnable codebases, flat documentation collections, and knowledge archives. There is no top-level git repo, no top-level build, and no single tech stack. Treat each top-level folder as an independent project and orient there before acting.

One subtree has its own `CLAUDE.md` with scope-specific rules — read it when working inside:
- `FF-CC/Claude Code FlashFusion/CLAUDE.md` — Go-specific dev rules, mandatory pre-commit hooks, "Research → Plan → Implement" workflow

## Top-level layout

| Folder | Type | What lives here |
|--------|------|-----------------|
| `Cortex-Nextus-AutoAI/` | Flat docs | ~44 numbered `.md` spec files for an AI agent framework (action schemas, execution state, RAG, caching, tool registry, audit logging, Supabase connectors). No code, no build — these are architectural specifications. |
| `FF-CC/` | Nested project | `Claude Code FlashFusion/` has its own `CLAUDE.md`, `commands/`, `hooks/`, `settings.json`, and a Nix file. Go-focused, strict hook-driven workflow. |
| `FlashFusion-Enterprise/` | Multi-service codebase | **The main runnable project.** 16 microservices orchestrated by `docker-compose.yml` and `start-all.sh`. Python 3.13 services use `pyproject.toml`; Node services use `package.json`. |
| `KAR/` | Knowledge archive | Numbered taxonomy (`01_Prompting`, `02_Projects`, `03_Reference`, `04_Templates`, `05_Infrastructure`, `06_Archive`) with `_INDEX.md` files. Also contains `NoCode/`, `Personal-Development/`, and `docs/plans/`. |

## FlashFusion-Enterprise — commands

This is the only subtree with a real build/run story. See `FlashFusion-Enterprise/README.md` for the full service map and ports 8000–8015 / 9000.

```bash
# From FlashFusion-Enterprise/
./start-all.sh                              # Starts all 16 services
docker-compose up -d redis postgres prometheus grafana   # Infra only
docker-compose up -d                        # Full stack

# Python service dev loop (pattern applies to any *-orchestrator/*-hub/*-engine/*-manager)
cd <service-name>
pip install -e .[dev]
cp .env.example .env
python -m uvicorn src.main:app --host 0.0.0.0 --port <port> --reload

# Tests
./run-all-tests.sh                          # All services
pytest tests/ -v --cov=src                  # Single service (from its dir)

# System management
python manage-system.py                     # Entry point for cross-service ops
```

Node services (`ai-cli-router`, `api-integration-hub`, `e2b-integration`, `chaoscollective-enterprise`, `claude-multi-agent-system/{electron,frontend}`, several under `mcp-servers/`) use standard `npm install` / `npm run <script>` — read the individual `package.json` first.

`claude-multi-agent-system/` has its own `Makefile` — use that rather than inventing commands.

## KAR/ knowledge archive

Each numbered folder has an `_INDEX.md` that describes its contents and a "When to add here" rule. Follow those rules when placing new material:

- `01_Prompting/` — prompt frameworks, libraries (incl. `KAR1/` versioned archive), planning, notion-prompts
- `02_Projects/` — per-project artifacts (`FlashFusion` [blueprint, brand, enterprise, technical, ui-ux, tech-debt, files, _needssorting], `HarvestFlow`, `AIAppSuite`, `SaaSIdentifier`, `Base44PlatformMigrationDocs`, `Business_and_Strategy`, `CopilotStudio`)
- `03_Reference/` — external resources (repos, research, design, knowledge-base incl. `GPTKB/` prompt gen docx files)
- `04_Templates/` — reusable starters and automation templates
- `05_Infrastructure/` — deployment configs, MCP servers, lifecycle bundles, claude-code-config (incl. checklists)
- `06_Archive/` — attachments, chat-history, media, unsorted, videos

## FlashFusion target tech stack

- **Frontend:** Next.js + RSC, Tailwind CSS, shadcn/ui, R3F, Framer Motion
- **Backend:** tRPC / GraphQL / REST, Supabase (Postgres + Auth + RLS)
- **AI:** LLM orchestration (CoT, ReAct, ToT, RAG), agent framework with HITL
- **Payments:** Stripe
- **Deployment:** Vercel (primary), plus Docker Compose for Enterprise services
- **Observability:** Sentry, OpenTelemetry, Langfuse
- **Brand:** Dark-first glassmorphism, purple (#a855f7) / rose (#f472b6) / dark bg (#0f0618)

## Working conventions

- **Orient before acting.** Figure out which subtree the task belongs to and read its `_INDEX.md` or `CLAUDE.md` (if any) first. Instructions in nested `CLAUDE.md` files take precedence inside their subtree.
- **No top-level git.** Individual subtrees (notably `FlashFusion-Enterprise/.github/`) may be separate repos or not — check before assuming git operations work.
- **`Cortex-Nextus-AutoAI/` is spec docs, not code.** Numbered prefixes reflect spec numbering, not ordering. Duplicates were cleaned as of 2026-04-16.
- **Windows paths.** The shell is bash-on-Windows; use forward slashes and `/dev/null`, but remember absolute paths start with `D:/`.
- **Parent context.** This directory is tracked under the `homebase` domain; see `D:\02_Homebase\CLAUDE.md` for cross-domain rules.
