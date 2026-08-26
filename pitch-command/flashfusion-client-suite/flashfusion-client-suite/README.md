# FlashFusion Client Enablement Suite

The full champion-model toolkit for an AI enablement engagement — from first intake
through measured outcomes. Five browser tools that chain together. Everything runs
locally; nothing is sent anywhere.

---

## Quick start

1. **Unzip** this folder anywhere on your computer.
2. **Open `index.html`** in any modern browser (Chrome, Edge, Safari, Firefox).
3. That's it. The hub links all five tools. No install, no login, no internet account.

> Tools load React from a CDN, so the **first open of each tool needs an internet
> connection**. After that the tools work offline. Your data is stored in the browser's
> `localStorage` and never leaves your machine.

---

## The five tools (use in this order)

| # | Tool | File | What it does |
|---|------|------|--------------|
| 01 | **Pre-Session Intake** | `tools/intake.html` | Capture the champion's role, tools, AI literacy, goals, pain points. Feeds 02 and 04. |
| 02 | **Prompt Package Builder** | `tools/prompt-builder.html` | Turn intake data into copy-ready prompts mapped to real use cases. |
| 03 | **Self-Service Setup Guide** | `tools/self-service.html` | A checklist the champion works through independently. Progress saves. |
| 04 | **Session Outcome Tracker** | `tools/outcome-tracker.html` | Log each session + run the QC checklist. Your evidence base for case studies. |
| 05 | **Objection Handler** | `tools/objection-handler.html` | 20 searchable answers to security, reliability, job, cost, and competitor objections. |

### How they chain
- **01 → 02:** the Prompt Package Builder reads saved intakes so the champion dropdown is pre-filled.
- **01 → 04:** the Outcome Tracker reads saved intakes for the champion dropdown.
- **03** is standalone — hand it to the champion to do on their own.
- **05** is a reference — pull it up whenever a stakeholder pushes back.

Because all tools share the browser's `localStorage`, **open them from the same browser
on the same machine** to keep the chain connected.

---

## Data & privacy

- All data lives in `localStorage` under keys: `intake-records-v1`, `prompt-packages-v1`,
  `self-setup-v1`, `outcome-records-v1`.
- Nothing is transmitted. There is no backend.
- Clearing your browser's site data for this folder resets the suite.
- To move data between machines, the tools are designed so you can extend them with a
  JSON export button (not included in v1.0).

---

## Customizing

- **Design system:** `assets/design-system.css` — the Reading Room at Midnight (Variant B)
  tokens. Change colors/type once, everywhere updates.
- **Shared helpers:** `assets/suite.js` — save/load/uid/today/download utilities.
- **Tool content:** each tool's data arrays (use cases, checklist steps, Q&A) live at the
  top of its `.html` file in plain JavaScript — edit directly.

---

## Optional: live AI in the Objection Handler

v1.0 ships the Objection Handler as a fully offline, pre-loaded Q&A reference (20 answers).
A live-AI version that generates custom rebuttals via the Claude API can be wired in, but
requires a backend proxy to hold the API key securely — a standalone downloaded file
should never embed a raw key. If you want the live version, it belongs on a hosted surface
(e.g. the FlashFusion site), not in this offline bundle.

---

## Verify the build

All factual claims in the Objection Handler reference Anthropic's own published policies
(privacy, SOC 2, plan features). Verify current specifics at `anthropic.com/legal/privacy`
and `trust.anthropic.com` before quoting to a client — plan features change.

---

FlashFusion · Abstrekkt · Suite v1.0
Reading Room at Midnight design system · Playfair Display / IBM Plex Sans / IBM Plex Mono
