---
title: 01_Inbox - Drain Rules
purpose: staging area for unsorted/unfiled content; not a long-term home
created: 2026-04-30
last_drained: 2026-05-08
---

# 01_Inbox

Staging ground. Stuff lands here before it gets a real home.

## Current lanes

- `downloads/` - raw downloaded assets and archive files, grouped by media type.
- `screenshots/` - image captures and screenshots.
- `ai-outputs/` - AI/LLM artifacts before curation.
- `repos-to-sort/` - repo-like bundles or cloned projects that still need canonical placement.
- `unsorted/` - loose items that do not yet have a clear lane.

## What goes here

- Downloads you have not filed yet -> `downloads/`
- Screenshots -> `screenshots/`
- AI/LLM artifacts before curation -> `ai-outputs/`
- Repos you cloned but have not slotted into `D:/03_Development/` or `E:/` -> `repos-to-sort/`
- Anything else loose / not-yet-categorized -> `unsorted/`

## What does not go here

- Active in-progress work - file it in its proper lane.
- Backups - those go to `D:/08_Backups-Archive/`.
- Anything you have already decided to keep long-term - file it now.

## Drain rule

Items older than 2 weeks should be reviewed. Items older than 30 days should be filed, archived, or deleted after explicit confirmation.

## Drain workflow

1. Walk each lane.
2. For each item: file it to the right long-term home, or mark it for deletion review.
3. Update `last_drained` in this file.
4. Update `_INDEX.md` with the current inventory and next actions.

## Migration backlog

- `D:/Chaos/` - review, file or delete, then remove only after confirmation.
- `D:/Stray-Root-Files/` - same.
- `D:/notebooks/` - verify it is not load-bearing, then file or delete.
- Loose `.md` files at `D:/` root -> move to `unsorted/` if needed.
