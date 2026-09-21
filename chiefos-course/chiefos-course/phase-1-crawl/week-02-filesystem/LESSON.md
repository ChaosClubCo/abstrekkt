# Week 2 — The Filesystem 🐣

**Phase:** Crawl · **Survey gap:** Terminal (2.4) · **Goal:** Understand *where things live* and how to move, copy, and inspect them.

## TL;DR
Files and folders form a tree. This week you learn to copy, move, delete, and look inside things safely — and to understand **paths** (the "address" of any file).

## Analogy
A path is a **mailing address**. `/home/kyle/projects/app.js` reads like Country → City → Street → House. An **absolute path** starts from the root `/` (the full address). A **relative path** starts from where you're standing right now (`./app.js` = "the app.js right here").

## Why this matters
Every error you'll ever hit that says "file not found" is a path problem. AI assistants get paths wrong constantly. If you understand paths, you catch the AI's mistakes. If you don't, you're stuck.

## Core menu
| Command | Says |
|---|---|
| `cp <src> <dest>` | copy a file |
| `cp -r <src> <dest>` | copy a whole folder |
| `mv <src> <dest>` | move OR rename |
| `rm <file>` | delete a file (no trash — it's gone) |
| `rm -r <folder>` | delete a folder and everything in it (dangerous) |
| `head <file>` / `tail <file>` | first / last 10 lines |
| `grep "text" <file>` | find lines containing "text" |
| `find . -name "*.txt"` | find files by pattern |

## The one dangerous command
`rm -rf` deletes without asking and without a trash can. Never run it on a path you're unsure of. This is a real FSR safety habit: **know your path before you destroy anything.**

## Absolute vs relative — the whole idea
- `pwd` shows your absolute location.
- `cd projects` (relative) works only if `projects` is right here.
- `cd /home/kyle/projects` (absolute) works from anywhere.

## Technical definition
The **filesystem** is a hierarchical tree of directories and files rooted at `/`. Every file has a unique **absolute path** from the root. The shell resolves **relative paths** against the current working directory.

➡️ Do [`EXERCISES.md`](EXERCISES.md).
