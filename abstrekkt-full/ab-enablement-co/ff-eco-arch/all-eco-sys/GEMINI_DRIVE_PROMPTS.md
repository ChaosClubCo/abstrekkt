# Gemini Drive Reorg — Paste-Ready Prompt Pack
**For: Gemini in Google Workspace (has native Drive access).** Run in order. Each block is copy-paste. Guardrails are built in — nothing deletes; everything moves to `_Archive` so it's reversible.

> **Why prompts, not me doing it:** Gemini acts on your Drive natively and in bulk. My Drive connector moves one file at a time and can't see your whole tree. For a full reorg, Gemini is the right tool. (I can still do targeted moves if you'd rather — see end.)

---

## Context Gemini needs (paste this FIRST, once)

```
You are reorganizing my Google Drive. Rules, no exceptions:
1. NEVER permanently delete anything. To remove, MOVE to a folder named "_Archive".
2. Before any batch move, show me the list of files you're about to move and wait for my "go".
3. Preserve all sharing links — use move, not copy-then-delete, wherever possible.
4. Work one numbered step at a time. Stop after each and report what changed.
5. If a folder name collides with an existing one, report it — do not merge blindly.

My canonical folder scheme (already used on my local drive — match it exactly):
  01_Abstrekkt      — brand, personal site, holding-co, brand canon
  02_Homebase       — command center: plans, audits, canon docs, project state
  04_INTInc         — DAY-JOB material. KEEP SEPARATE. Never mix with 01/05.
  05_FlashFusion    — consultancy: clients, pipeline, sales, playbooks, audits
  06_Media          — video, images, audio, AI Studio cards
  07_Inbox          — staging / triage landing zone
  08_Backups-Archive — superseded, retired, stale
  _Archive          — anything being removed (reversible trash)

Note: there is NO "Chaos" anything anymore — that brand is retired. NO code folders
in Drive (src/, components/, utils/, 0X-development) — code belongs in GitHub.
Confirm you understand these rules before I give Step 1.
```

---

## Step 1 — Map the current root

```
List every folder and loose file at the root of my Google Drive (My Drive), with
last-modified date. Flag: (a) any duplicate folder names, (b) any folder whose name
starts with a number, (c) any loose files not inside a folder. Don't move anything yet.
```

---

## Step 2 — Create the clean lane folders

```
Create these folders at My Drive root if they don't already exist:
01_Abstrekkt, 02_Homebase, 04_INTInc, 05_FlashFusion, 06_Media, 07_Inbox,
08_Backups-Archive, _Archive
Report which were created vs already existed. Do nothing else.
```

---

## Step 3 — Retire the Chaos folders (reversible)

```
There are one or more folders named "01_Chaos" (the retired ChaosClubCo brand).
Move them — intact, do not unpack — into 08_Backups-Archive/ and rename to
"01_Chaos_RETIRED_<original-date>". List what you moved and confirm.
Do NOT delete. I'll salvage anything still-live from there separately.
```

---

## Step 4 — Quarantine the unverified knowledge deposits

```
Inside "04_Knowledge" there are ~9 NotebookLM / Claude-ecosystem documents that
contain unverified or fabricated content. Do NOT trust them as source material.
Create a folder: 08_Backups-Archive/UNVERIFIED_DO_NOT_USE/
Move the entire "04_Knowledge" folder contents there. List what moved.
If any document in 04_Knowledge is clearly NOT an AI-generated ecosystem deposit
(e.g. a real plan or note I wrote), flag it separately instead of moving it.
```

---

## Step 5 — Resolve the numbering collisions

```
I have colliding numbered folders at root. Reconcile them WITHOUT merging blindly:
- "01_Inbox" → rename/move its contents into 07_Inbox, then archive the empty shell.
- "03_Projects" → for each item inside, tell me which lane it belongs to
  (Abstrekkt / FlashFusion / INTInc / Media) and propose a destination. WAIT for my go.
- "03_Docs-pics-audio-video" → move media (images/video/audio) into 06_Media;
  move documents into 07_Inbox for me to sort. List the split before moving.
Report the collision resolution plan and wait for approval before executing.
```

---

## Step 6 — Pull code out of Drive

```
These root folders are a code repository that does not belong in Google Drive:
src/, components/, utils/, shared/, security/, 01-planning/, 02-design/,
03-development/, webnflow-best-practices-fixes/
Move ALL of them, intact, into 08_Backups-Archive/code-pending-github/ and
flag them for me to relocate to GitHub. Do not unpack or modify contents.
List what you moved.
```

---

## Step 7 — File loose root documents by lane

```
For every loose document still at My Drive root, classify it into one lane and
propose a destination folder. Use these signals:
- "Abstrekkt", brand, design tokens, personal site, KYLE_DESIGN → 01_Abstrekkt/
- plans, audits, "PROJECT_STATE", rebuild, command-center, briefings → 02_Homebase/
- INT, day-job, enterprise client delivery → 04_INTInc/  (KEEP SEPARATE)
- FlashFusion, client, pipeline, audit instrument, playbook, 1871 application → 05_FlashFusion/
- memoir, "Construction Not Recovery", scenes, characters, songs → 01_Abstrekkt/Memoir/
- video/image/audio → 06_Media/
- anything you can't classify → 07_Inbox/
Show me the full classification table. WAIT for my go before moving.
```

---

## Step 8 — De-dupe the brand canon

```
Search my Drive for files named "ABSTREKKT_DESIGN.md" — there are two copies.
Also find "brand-config-abstrekkt.md" and "KYLE_DESIGN.md".
Move all of them into 01_Abstrekkt/canon/.
Then show me, side by side, the base/background color value each one uses
(I know one says #0d0c0a and another says #0E0C13 — I need to pick one).
Do not edit them — just surface the conflict so I can reconcile.
```

---

## Guardrail recap
- Nothing is deleted — `_Archive` and `08_Backups-Archive` are reversible.
- Steps 5 and 7 stop for your approval before moving (they involve judgment).
- INT stays in its own lane, never mixed with Abstrekkt/FlashFusion.
- Code and the unverified knowledge deposits are quarantined, not trusted.

## If you'd rather I do it
I can execute targeted moves directly via the Drive connector — best for small, specific
jobs (e.g. "move these 6 canon files into one folder"). For a full-tree reorg, Gemini wins
on speed and bulk. Tell me which.
