# Week 8 — Exercises (Phase 2 Gate)

## The broken repo
Clone the practice repo the instructor provides (or recreate `buggy.js` below). It has 3 planted bugs. Find and fix each using the debugging loop — and **write down your hypothesis for each before you fix it.**

`buggy.js` (has 3 bugs):
```javascript
function getInitials(fullName) {
  const parts = fullName.split(" ");
  return parts[0][0] + parts[1][0];
}

function greetAll(names) {
  let out = "";
  for (let i = 0; i <= names.length; i++) {
    out += "Hi " + names[i] + "\n";
  }
  return out;
}

const people = ["Ana Ruiz", "Ben", "Cam Diaz"];
console.log(people.map(getInitials));
console.log(greetAll(people));
```

## Drill 1 — Reproduce
```bash
node buggy.js
```
Read the FIRST error. Write down: what does the last line say, and what line number?

## Drill 2 — Hypothesize + test each bug
For each bug, in `debug-log.md` write:
- The error (plain English).
- Your hypothesis (what you think is wrong and why).
- The test you ran (`console.log` you added, what it showed).
- The fix, and why it's the *cause* not the symptom.

Hints (don't read until you've tried):
- Bug 1: `getInitials("Ben")` — `parts[1]` doesn't exist. What happens?
- Bug 2: the loop condition `<=` runs one time too many. What's `names[3]`?
- Bug 3: after fixing, verify every person greets correctly.

## Drill 3 — Fix and confirm
Fix all three. `node buggy.js` should run clean and produce sensible output. Commit your fixed version.

## Drill 4 — Containerize it (Phase 2 integration)
Write a Dockerfile for your fixed `buggy.js`, build it, and run it in a container. This proves you can combine Week 6 + Week 8.

## Submit → [`CHECK.md`](CHECK.md)
