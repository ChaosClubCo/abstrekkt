# Week 4 — Exercises (Phase 1 Gate)

Complete the whole loop. This is graded as the Phase 1 gate (10% of course).

## Step 1 — New repo
```bash
cd ~ && mkdir my-profile && cd my-profile
git init
```

## Step 2 — Build a tiny page (type it, don't paste)
Create `index.html`:
```html
<!DOCTYPE html>
<html>
<head><title>My Profile</title></head>
<body>
  <h1>Your Name</h1>
  <p>Learning agentic coding at Temple College.</p>
  <ul>
    <li>Week 1: terminal</li>
    <li>Week 2: filesystem</li>
    <li>Week 3: Git</li>
  </ul>
</body>
</html>
```
Open it: double-click the file, or `open index.html` (mac) / `start index.html` (win) / `xdg-open index.html` (linux).

## Step 3 — Commit the base
```bash
git add index.html
git commit -m "Add profile page skeleton"
```

## Step 4 — Push to GitHub
Create an empty `my-profile` repo on GitHub, then:
```bash
git remote add origin https://github.com/YOURNAME/my-profile.git
git push -u origin main
```

## Step 5 — Branch, change, PR
```bash
git checkout -b add-goals
```
Add this to `index.html` before `</body>`:
```html
<h2>My goal</h2>
<p>Ship a real app by Week 12.</p>
```
Then:
```bash
git add index.html
git commit -m "Add goals section"
git push -u origin add-goals
```
On GitHub, click **"Compare & pull request"**, write a one-line description, open the PR,
then **merge it**. Congratulations — that's the professional loop.

## Submit → [`CHECK.md`](CHECK.md)
