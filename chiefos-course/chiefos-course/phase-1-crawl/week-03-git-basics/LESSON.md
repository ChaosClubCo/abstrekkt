# Week 3 — Git Basics 🐣

**Phase:** Crawl · **Survey gap:** Git avg 1.8 (41% "none," 41% "awareness only")
**Goal:** Save versions of your work and put them online — without fear.

## TL;DR
Git is a **save system with unlimited undo and a full history**. You take snapshots (commits) of your project as you go, and you can push those snapshots to GitHub so they're backed up and shareable.

## Analogy
Git is a **video game save system**. A `commit` is hitting "save" — you name the save so you remember what you did ("beat the boss"). If you mess up later, you can load an earlier save. `push` uploads your saves to the cloud so you never lose them.

## Why this is a top priority
41% of you have never touched Git and another 41% only know the words. Git is non-negotiable in real work — ChiefOS, every job, every team runs on it. AI tools generate code, but *you* have to version and ship it. This week is the single biggest fundamentals unlock in the course.

## The four commands you'll use daily
| Command | Says |
|---|---|
| `git init` | "Start tracking this folder" |
| `git status` | "What's changed?" (run this constantly) |
| `git add <file>` | "Include this in my next save" |
| `git commit -m "message"` | "Save it, with a note" |

## Plus, to work with GitHub
| Command | Says |
|---|---|
| `git clone <url>` | "Download a repo from GitHub" |
| `git push` | "Upload my commits to GitHub" |
| `git pull` | "Download others' commits" |
| `git branch` / `git checkout -b <name>` | "Make a parallel version to work on safely" |

## The mental model: three zones
1. **Working directory** — your files as they are now.
2. **Staging area** — what you've `add`ed, queued for the next commit.
3. **Repository** — the committed history.

Flow: edit → `add` (stage) → `commit` (save) → `push` (upload). Say it out loud until it sticks.

## Why branches exist
A **branch** is a safe parallel copy. You try something risky on a branch; if it works you merge it in, if it doesn't you throw the branch away. Your main code is never at risk. Real teams never work directly on `main`.

## Technical definition
Git is a **distributed version control system**. Each commit is an immutable snapshot identified by a hash, linked to its parent, forming a history graph. Branches are movable pointers to commits.

➡️ Do [`EXERCISES.md`](EXERCISES.md).
