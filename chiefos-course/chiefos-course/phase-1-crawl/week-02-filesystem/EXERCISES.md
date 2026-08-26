# Week 2 — Exercises

Type everything. Read output before moving on.

## Drill 1 — Copy and rename
```bash
cd ~ && mkdir -p week2 && cd week2
echo "original" > a.txt
cp a.txt b.txt        # copy
mv b.txt c.txt        # rename b -> c
ls                    # expect a.txt and c.txt
cat c.txt             # still says "original"
```

## Drill 2 — Move into folders
```bash
mkdir archive
mv a.txt archive/     # move a.txt into archive
ls                    # a.txt is gone from here
ls archive            # ...it's in here
```

## Drill 3 — Absolute vs relative (do this thoughtfully)
```bash
pwd                          # note your absolute path
cd /                         # go to the root
ls                           # the top of the whole tree
cd ~/week2                   # absolute path home-ward
cd archive                   # relative, only works from week2
pwd
```
Write one sentence: when did relative fail-proofly work, and when would it break?

## Drill 4 — Search inside files
```bash
cd ~/week2
printf "apple\nbanana\napricot\n" > fruit.txt
grep "ap" fruit.txt          # lines containing "ap"
find . -name "*.txt"         # every .txt under here
```

## Drill 5 — Safe deletion
```bash
mkdir trash-test && touch trash-test/junk.txt
rm trash-test/junk.txt       # delete one file
rmdir trash-test             # remove the now-empty folder
```
Never practice `rm -rf` on real folders. Understand it; respect it.

## Submit → [`CHECK.md`](CHECK.md)
