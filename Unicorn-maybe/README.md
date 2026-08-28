# Unicorn-maybe (FlashFusion)

**Status**: Active — MVP build phase  
**Last updated**: 2026-05-08

## What this is

FlashFusion is a custom merchandise automation platform targeting creators and communities. The core value prop: streamline the order-to-print-to-ship pipeline for on-demand customization at scale.

This workspace contains everything — the active web app, strategic docs, research, and prototypes.

## Structure

```
Unicorn-maybe/
├── flashfusion-web/       # Active Next.js application (PRIMARY)
├── docs/                  # Strategic docs: pitch, financials, vision, Anthropic app
├── research/              # NotebookLM exports, session notes, source files
├── prototypes/            # Early HTML prototypes (v1 parallax, v2)
├── archive/               # AIFramework — archived March 2026
└── README.md              # This file
```

## How to run

```bash
cd flashfusion-web
npm install
npm run dev
```

See [flashfusion-web/CONTEXT.md](./flashfusion-web/CONTEXT.md) for architecture decisions, active branch, and environment setup.

## Key docs

- `docs/VISION.md` — Product vision and north star
- `docs/MVP_PITCH_PACK.md` — Investor-facing pitch materials
- `docs/FINANCIAL_MODEL.md` — Revenue model and projections
- `docs/ANTHROPIC_PARTNER_APPLICATION.md` — Anthropic partnership application

## Notes

- `AIFramework/` at root is an empty ghost directory — safe to delete manually
- All AIFramework content is properly archived under `archive/AIFramework/`
