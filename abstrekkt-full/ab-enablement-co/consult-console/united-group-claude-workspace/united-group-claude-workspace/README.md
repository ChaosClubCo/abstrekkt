# United Group — Claude Team Workspace Setup

A complete, deployable setup for United Group, Inc.'s Claude **Team** workspace:
standard member instructions, six shared projects with knowledge inventories,
starter org skills, governance rules, per-role runbooks, and a measurement tracker.

Built by FlashFusion. Owner: Ryan Anderskow (champion). Sponsor: Paul Monfardini (founder).

---

## How to read this repo

| Folder | What's in it |
|---|---|
| `org-setup/` | Member profile instructions, brand voice Style, governance rules |
| `projects/` | Six shared projects — each with instructions + a knowledge inventory to upload |
| `skills/` | Four starter skills (SKILL.md each), ready to distribute org-wide |
| `enablement/` | Per-role runbooks — the half-pagers that make people actually use it |
| `measurement/` | Before/after baseline tracker — this becomes the case study |
| `00-DEPLOY-CHECKLIST.md` | The ordered setup steps, with Owner-rights flags |

---

## 🔑 The admin-rights gate (read first)

Some steps require the **Primary Owner / Owner** of United Group's Claude workspace —
not just a member login. Anything that touches **org connectors** or **org-wide skill
distribution** is Owner-only. Each such step is marked:

> 🔑 **NEEDS WORKSPACE OWNER**

**Before deploying, confirm who owns the workspace.** If it's Ryan → full build is unblocked.
If it's someone else (likely Paul or IT) → ship everything that isn't Owner-gated first,
then book 20 minutes with the Owner to finish the org-level pieces.

---

## What Team can and can't do (so we don't over-promise)

- ✅ Shared projects, shared knowledge, activity feed, persistent memory
- ✅ Team data is **not** used to train models (the line that gets Paul's blessing)
- ✅ Native connectors: Google Drive, Gmail, Google Calendar, Microsoft 365, Slack, GitHub
- ✅ Admin-distributed skills across the org
- ⚠️ CRM / order system → via Zapier or Make (not native)
- ❌ Granular custom roles & permission tiers → that's **Enterprise**, not Team. Not used here.

---

## Deploy order (summary)

1. Governance + member profile block (`org-setup/`)
2. Brand voice Style
3. Six shared projects + load knowledge (`projects/`)
4. Distribute starter skills (`skills/`) — 🔑 Owner
5. Connectors — 🔑 Owner
6. Per-role runbooks + 30-min walkthrough (`enablement/`)
7. Baseline the 3 measured tasks (`measurement/`)

Full detail in `00-DEPLOY-CHECKLIST.md`.
