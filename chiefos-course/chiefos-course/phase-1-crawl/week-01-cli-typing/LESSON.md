# Week 1 — CLI Typing Drills 🐣

**Phase:** Crawl · **Survey gap:** Terminal skill avg 2.4 ("basic with help")
**Goal:** Make the terminal feel like a keyboard, not a wall.

---

## TL;DR
The terminal is just a text way to tell your computer what to do. This week you build
**muscle memory** for a handful of commands by typing them until they're automatic — the
same way you learned to type words without looking at the keys.

## Analogy
A terminal is a **drive-through speaker**. You say a specific thing (`cd Desktop`), it does
a specific thing (moves you to the Desktop). It only understands its own menu. Learn the
menu and it's fast; guess at the menu and you get "command not found."

## Why we start here
Every tool in this course — Git, Docker, deploying apps, running AI agents — is driven from
the terminal. Your classmates who "prompt their way through" never get comfortable here, so
they can't tell when something actually ran. We fix that in Week 1 so nothing after it feels
like magic.

---

## The core menu (memorize by doing)

| Command | Says | Example |
|---------|------|---------|
| `pwd` | "Where am I?" | `pwd` |
| `ls` | "What's here?" | `ls` |
| `ls -la` | "What's here, everything, with detail?" | `ls -la` |
| `cd <folder>` | "Go into this folder" | `cd Desktop` |
| `cd ..` | "Go up one level" | `cd ..` |
| `cd ~` | "Go home" | `cd ~` |
| `mkdir <name>` | "Make a folder" | `mkdir practice` |
| `touch <name>` | "Make an empty file" | `touch notes.txt` |
| `cat <file>` | "Show me this file" | `cat notes.txt` |
| `clear` | "Clean the screen" | `clear` |

**Two lifesavers:**
- **Tab** = autocomplete. Type `cd Des` then hit Tab → it finishes `Desktop`. Use it constantly.
- **Up arrow** = your last command back. Stop retyping.

---

## The mental model

Your computer is a tree of folders. You are always **standing in one folder** (that's what
`pwd` tells you). `cd` walks you around the tree. `ls` looks around wherever you're standing.
That's 80% of terminal use: know where you are, move, look.

---

## Technical definition
A **CLI (command-line interface)** is a text-based program (a **shell**, e.g. `bash` or
`zsh`) that reads commands, executes them, and prints output. Each command is a program;
arguments (like `-la`) modify its behavior. The shell tracks a **working directory** — your
current location in the filesystem.

---

## What "good" looks like this week
You can open a terminal and, without looking anything up, make a folder, go into it, create
a file, and confirm it's there — in under 15 seconds. That's the whole bar. Speed comes from
reps, which is why this week is drills.

➡️ Now do [`EXERCISES.md`](EXERCISES.md).
