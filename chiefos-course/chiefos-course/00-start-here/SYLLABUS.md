# Syllabus — ChiefOS Agentic Coding Course

**Duration:** 12 weeks · 3 phases · ~4–6 hrs/week (1 live session + reps)
**Cost:** Free (Meta workforce sponsorship)
**Outcome:** A shipped application + FSR interview eligibility

---

## Design rationale (why this order)

The survey (41 respondents, 1–5 scale) showed a cohort that is **motivated but
under-fundamentaled**. Averages:

| Skill | Avg | Read as |
|-------|-----|---------|
| Q1 Writing code | 1.7 | Can't yet |
| Q4 Finding/fixing bugs | 1.6 | Can't yet |
| Q5 Docker | 1.5 | Never touched |
| Q3 Git | 1.8 | Heard of it |
| Q2 Terminal | 2.4 | Basic with help |
| Q6 Reading others' code | 2.0 | Awareness |
| Q7 AI while coding | 2.3 | Somewhat confident |
| Q8 Prompting/reviewing AI | 2.3 | Intermediate on own |

**The trap this cohort is in:** prompting confidence (2.3) is *higher* than code-writing
confidence (1.7) and bug-fixing (1.6). That gap is exactly how people get stuck
"prompting their way through" without a developer mindset. The curriculum deliberately
raises the floor (CLI, Git, reading code, debugging) **before** leaning on AI, so AI
becomes an amplifier instead of a crutch.

---

## PHASE 1 — CRAWL (Weeks 1–4)
*Goal: eliminate terminal fear and Git fear. Build muscle memory.*

| Wk | Title | Core skill | Survey gap addressed |
|----|-------|-----------|----------------------|
| 1 | CLI Typing Drills | Navigate + type commands fluently | Q2 terminal (2.4) |
| 2 | The Filesystem | Files, paths, permissions, redirection | Q2 terminal |
| 3 | Git Basics | clone/commit/push/branch | Q3 Git (1.8) |
| 4 | Your First Repo | End-to-end: repo → commits → push → PR | Q3 Git + Q1 writing (1.7) |

**Phase 1 gate:** You push a repo with 5+ meaningful commits and open one pull request.
**FSR skill proved:** You can operate a machine you didn't set up.

---

## PHASE 2 — WALK (Weeks 5–8)
*Goal: comprehension. Read code, run containers, pair with AI on purpose, debug with method.*

| Wk | Title | Core skill | Survey gap addressed |
|----|-------|-----------|----------------------|
| 5 | Reading Code You Didn't Write | Trace, annotate, summarize a codebase | Q6 reading (2.0) |
| 6 | Docker Without Fear | images, containers, `docker run`, compose | Q5 Docker (1.5) |
| 7 | AI Pairing Done Right | Prompt → review → catch mistakes | Q7 (2.3), Q8 (2.3) |
| 8 | Debugging on Purpose | Read errors, form hypotheses, bisect | Q4 bugs (1.6) |

**Phase 2 gate:** You take a broken repo, containerize it, find the bug with AI's help,
and explain the fix in your own words.
**FSR skill proved:** You can diagnose a system in the field, not just describe symptoms.

---

## PHASE 3 — RUN (Weeks 9–12)
*Goal: delivery. Drive agentic workflows and ship something real.*

| Wk | Title | Core skill | Survey gap addressed |
|----|-------|-----------|----------------------|
| 9 | Agentic Workflows | Plan → execute → review loop; spec writing | Top stated goal |
| 10 | Build a Real App | Full app, AI-assisted, human-owned | Q10 (66% never built) |
| 11 | Deploy It | Host, environment vars, secrets, smoke test | Real-world readiness |
| 12 | Capstone + Demo | Ship, present, defend your build | Q10 shipping (7%) |

**Phase 3 gate:** A deployed, running app + a 5-minute demo you can defend.
**FSR skill proved:** You can deliver and stand behind working software.

---

## Weekly rhythm

1. **Before class:** read `LESSON.md`.
2. **In class (live):** instructor demo + guided reps.
3. **After class:** `EXERCISES.md` reps, then `CHECK.md` self-check + submit.

---

## What you need

See [`SETUP.md`](SETUP.md). Short version: a terminal, Git, Docker Desktop, VS Code,
a GitHub account, and a Claude/Copilot account. All free tiers.

---

## Assessment weights

| Component | Weight |
|-----------|--------|
| Weekly reps (process) | 40% |
| Phase gates (3 × 10%) | 30% |
| Capstone (build + demo defense) | 30% |

No exams. You prove skill by doing.
