# Week 1 — Exercises

Do these in order. Repeat the drills until they're automatic. **No copy-paste** — type
every command. The typing is the point.

---

## Drill 1 — Warm-up (do 3 times)
```bash
pwd
ls
cd ~
pwd
clear
```
Goal: know where you are and get home from anywhere.

## Drill 2 — Make and move (do 3 times)
```bash
cd ~
mkdir week1-practice
cd week1-practice
pwd            # should end in /week1-practice
touch hello.txt
ls             # you should see hello.txt
cd ..
pwd            # back up one level
```

## Drill 3 — The 15-second challenge (time yourself)
Starting from your home folder, do all of this from memory:
1. Make a folder called `drill`
2. Go into it
3. Create a file called `test.txt`
4. Confirm it exists
5. Go back home

Beat 15 seconds. Then beat 10. Use **Tab** and **Up arrow**.

## Drill 4 — Read a file
```bash
cd ~/week1-practice
echo "I am learning the terminal" > hello.txt   # write text into the file
cat hello.txt                                    # read it back
```
`>` sends output into a file. You just wrote to a file from the command line.

## Drill 5 — Nested folders (Tab practice)
```bash
cd ~/week1-practice
mkdir -p a/b/c        # -p makes the whole chain at once
cd a/b/c
pwd
cd ~/week1-practice
ls -la a              # see what's inside 'a'
```
Then navigate into `a/b/c` again using **Tab** after every folder. Feel the autocomplete.

---

## Stretch (optional)
- `history` — see every command you've run. `!42` re-runs command #42.
- `man ls` — the manual for `ls`. Press `q` to quit. Every command has a `man` page.

---

## Submit
See [`CHECK.md`](CHECK.md).
