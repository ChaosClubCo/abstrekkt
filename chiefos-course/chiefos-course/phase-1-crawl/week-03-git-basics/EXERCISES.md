# Week 3 — Exercises

You need a GitHub account (see SETUP.md). Type everything.

## One-time setup
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Drill 1 — Your first tracked project
```bash
cd ~ && mkdir git-practice && cd git-practice
git init
git status                       # "No commits yet"
echo "# My Project" > README.md
git status                       # README.md shown as untracked (red)
git add README.md
git status                       # now staged (green)
git commit -m "Add project readme"
git status                       # clean
```
Run `git status` between every step. Watch files move: untracked → staged → committed.

## Drill 2 — Make 5 real commits
Edit README.md five times (add a real line each time) and commit after each:
```bash
echo "Line about what I'm learning" >> README.md
git add README.md
git commit -m "Add a note about learning terminal"
# repeat with a different real line and message, 5 times total
git log --oneline                # see your history
```
**Real messages only.** "update" x5 is not learning. Describe what changed.

## Drill 3 — Branch safely
```bash
git checkout -b experiment       # new parallel branch
echo "risky idea" >> README.md
git add README.md && git commit -m "Try a risky idea on a branch"
git checkout main                # switch back; README has NO risky line here
cat README.md                    # proof: main is untouched
git merge experiment             # bring the idea into main
```

## Drill 4 — Push to GitHub
1. On github.com, create a new **empty** repo called `git-practice`.
2. Connect and push:
```bash
git remote add origin https://github.com/YOURNAME/git-practice.git
git push -u origin main
```
3. Refresh the GitHub page. Your commits are online.

## Submit → [`CHECK.md`](CHECK.md)
