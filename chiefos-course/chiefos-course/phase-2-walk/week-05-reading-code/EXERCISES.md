# Week 5 — Exercises

## Provided file: `mystery.js`
Create this file exactly as written and read it — do NOT run it yet.
```javascript
// mystery.js
function parseScores(input) {
  const lines = input.trim().split("\n");
  const results = [];
  for (const line of lines) {
    const [name, raw] = line.split(",");
    const score = Number(raw);
    if (Number.isNaN(score)) continue;
    results.push({ name: name.trim(), score });
  }
  return results;
}

function average(records) {
  if (records.length === 0) return 0;
  const total = records.reduce((sum, r) => sum + r.score, 0);
  return total / records.length;
}

const data = "Ana, 90\nBen, 75\nCam, notanumber\nDee, 88";
const parsed = parseScores(data);
console.log(parsed);
console.log("Average:", average(parsed));
```

## Drill 1 — Read before running
Using the 5-step method, write (in a file `mystery-notes.md`):
1. What are the two functions?
2. What is the entry point / what runs first?
3. Trace the main path: what happens to the `data` string, step by step?
4. **Predict the output** before running. Write your prediction down.
5. One-sentence summary of the whole file.

## Drill 2 — Now run it
```bash
node mystery.js
```
Compare actual output to your prediction. Were you right about `Cam, notanumber`? Why is it excluded? (Trace the `if (Number.isNaN(score)) continue;` line.)

## Drill 3 — Annotate
Add a plain-English `//` comment above every line you had to think about. If you can't write the comment, mark it `// ??` and bring it to class.

## Drill 4 — Break it on purpose
Change `average` to divide by `records.length + 1`. Predict the new average, then run. Reading includes predicting the effect of a change.

## Submit → [`CHECK.md`](CHECK.md)
