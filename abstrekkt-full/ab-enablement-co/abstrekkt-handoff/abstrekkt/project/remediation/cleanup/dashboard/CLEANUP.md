# File 01 — "Design cohesive dashboard interface" · cleanup manifest

## What it actually is
A single-page **FlashFusion landing page** (`App.tsx` + `components/ff/*`).
Everything else is the wreckage of an abandoned attempt to build an app.

## DELETE — dead / broken (imports files that don't exist)
```
src/app/routes.tsx                      # imports 7 pages/* that were never created
src/app/components/Root.tsx             # router shell, unused
src/app/components/NavBar.tsx           # app nav, unused
src/app/components/OnboardingOverlay.tsx# 488-line flow wired to nothing
plans/design-ai-onboarding-distributed-bunny.md
```
> These reference `./pages/LandingPage`, `./pages/Dashboard`, `./pages/KanbanBoard`,
> `./pages/Documentation`, `./pages/WorkflowBuilder`, `./pages/CodeEditor`,
> `./pages/Settings` — none exist. Leaving them in = guaranteed build failure.

## KEEP — the actual product
```
src/app/App.tsx                 (entry — verify main.tsx renders <App/>, NOT RouterProvider)
src/app/components/ff/*         (Hero, Stats, Features, Differentiators, Customers,
                                 AnthropicBadge, Pricing, CtaSection, Footer, Nav,
                                 Scene, SignalCanvas, HudOverlay, CustomCursor)
src/styles/flashfusion.css, src/styles/fonts.css
```

## REPLACE with the hardened versions in this folder
```
BootScreen.tsx   → src/app/components/ff/BootScreen.tsx   (reduced-motion + skip + once/session)
cursor-fix.css   → import in App; remove every `cursor: "none"`; gate <CustomCursor/>
```

## DECIDE
If you genuinely want the dashboard the filename promised, that's a **new build**,
not a salvage — the seven screens never existed. Recommend: rename the project to
"FlashFusion Landing" and ship the page that works.
