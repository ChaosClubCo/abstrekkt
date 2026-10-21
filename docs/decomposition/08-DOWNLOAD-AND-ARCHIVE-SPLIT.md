# Download fix and private-archive split

Authority domain: `abstrekkt_publication`. Source branch: `claude/vibrant-tesla-nmrhk7`, measured 2026-10-21.

## Context

Kyle downloads `ChaosClubCo/abstrekkt` and the result "won't open". Kyle says size is not the limit; the download itself came out wrong. Measured in this session (read-only, branch `claude/vibrant-tesla-nmrhk7`):

- `abstrekkt`: 2.1 GB working tree, 617 MB git history. `the-verdict` is 25 MB and is not the problem.
- Four defects that break an unzip on Windows/macOS, each measured with `git ls-files`:
  1. `Memoir/` and `memoir/` both exist (plus `design.md`/`roadmap.md` case pairs). Case-insensitive disks merge or overwrite them.
  2. 50 filenames contain characters Windows forbids (`:`, `?`, `"`, `|`, `*`), e.g. names starting with `"# Memoir Excavation Capture`.
  3. 392 paths over 200 characters; inside `Downloads\abstrekkt-main\` these pass Windows' 260-char limit and fail to extract.
  4. 136 Git LFS files under `abstrekkt-full/`; a GitHub ZIP holds 130-byte pointer text files instead of the real media unless LFS-in-archives is enabled.

Goal: (A) a prompt Kyle pastes into Claude Code on his own computer that unzips the file he already has, diagnoses it, and asks him questions; (B) split the corpus into private repos whose files all extract cleanly.

## Part A: local Claude Code prompt (deliver verbatim to Kyle)

```
I downloaded my GitHub repo ChaosClubCo/abstrekkt as a ZIP and it will not open properly. The ZIP is still zipped in my Downloads folder. It contains private material (memoir, clinical records, a credentials file named Infinite-heroes-env.txt): never print file contents, never upload or push anything, never open the env file.

1. Find the ZIP in my Downloads folder. Tell me its name, size, and date, and ask me to confirm it is the right file before going on.
2. Test the archive without extracting it (`tar -tf` or `7z t` or `unzip -t`). Report whether it is complete or truncated. If truncated, stop and tell me to re-download it.
3. Ask me: which OS am I on, and where do I want it extracted? Suggest a short path such as C:\ab or ~/ab because some paths in it are very long.
4. Before extracting, list from the archive listing: (a) paths that differ only by upper/lower case (Memoir vs memoir), (b) filenames with : ? " | * < >, (c) paths longer than 200 characters. Show counts and 5 examples of each.
5. Ask me how to handle each group (rename on extract, skip, or extract that group into a separate folder). On Windows, offer to enable long paths first and tell me it needs an admin prompt.
6. Extract to the folder I chose, with the handling I picked. Then count files on disk vs files in the archive and show me any that are missing.
7. Find files that are Git LFS pointers (small text files starting with "version https://git-lfs.github.com/spec/v1"). Tell me how many and which folders. Explain they are placeholders, not the real media, and ask whether I want instructions to fetch the real files with `git lfs`.
8. Give me a short summary: what was wrong, what you fixed, what is still missing. Ask before doing anything beyond this list.
```

## Part B: split into private repos

Reuses the existing decomposition work; does not replace it.

- Strategy on record (`docs/decomposition/01-DECOMPOSITION_PLAN.md`, decision 4): fresh repos, files copied without history, this repo stays the archive of record. History is not rewritten.
- Copy mechanism: `scripts/extract-subtree.sh` / `scripts/extract_subtree.py` (denylist check, `--dry-run`, writes `MANIFEST.sha256`). Procedure: `docs/decomposition/03-EXTRACTION-RUNBOOK.md`. Receipts: `EXTRACTION_RECEIPT_TEMPLATE.md` into `docs/migrations/<repo>/`.
- Deletion gate (`repository-registry.yaml` `deletion_gate: target_hash_verified`): nothing is removed from `abstrekkt` in this plan. Slimming it is a later, separate approval.

### Target repos (all PRIVATE, under ChaosClubCo)

| Repo | Source paths | Approx size |
| --- | --- | --- |
| `abstrekkt-archive-enablement` | `abstrekkt-full/ab-enablement-co/` minus `flashfusion-OAAS/` and the nested self-copy `abstrekkt-handoff/abstrekkt/` | ~230 MB |
| `abstrekkt-archive-renders` | rest of `abstrekkt-full/` (`corridor_*`, `product_*`, `the_*` render folders) that are not private-lane | ~60 MB |
| `abstrekkt-media` (LFS for .mp4/.mov/.wav/.jpg >5 MB) | `project/uploads/`, `project/assets/`, `sedona/`, `Music/`, root-level images | ~650 MB, mostly LFS |
| `abstrekkt-studio` | `project/stitch_memory_corridor_studio/`, `project/corridor/`, `project/loadbearing/` | ~205 MB |
| `abstrekkt-private` (restricted, no collaborators) | `Memoir/` + `memoir/` merged into `memoir/` with case collision resolved, `memoir-source-pack/`, `clinical-source/`, `memoir_*`, private-lane `corridor_*` etc. per denylist "Private / restricted lane" section | ~45 MB |

Not moved by this plan: `Infinite-heroes-env.txt` and the 4 flagged credential files (never copied; rotation runbook `02` first); INT/Intinc material (excluded lane, stays put); Loxihart paths (handoff per `07-LOXIHART-HANDOFF.md`); `flashfusion-OAAS/` vendored repos (archive, never extract). App extractions (`abstrekkt-site`, `-edge`, `-a2a`) keep their own runbooks `04`-`06`.

### Code change (done in this branch)

`never-extract.denylist` blocked every private-lane and archive-only path, so these private repos could not be staged. `scripts/extract_subtree.py` now takes `--private-archive`, which:
- lifts only the `# --- Private / restricted lane` and `# --- Archive-only` denylist sections,
- keeps the live/possible credentials, INT/Intinc and Loxihart sections refused unconditionally (a nested `*intinc*` folder still blocks the whole selection),
- prints `PRIVATE ARCHIVE: target repository must be private` on every run.

The planned `.private-archive` marker file was dropped: the script requires a new, nonexistent staging directory, so a marker inside it cannot exist beforehand. The flag itself is the operator's statement.

Tests: `tests/test_extraction_boundary.py` (3 new cases: lifted sections copy with the flag; credentials and INT sections still refuse with it; private sections refuse without it).

### Clean-name pass (per new repo, at copy time)

Each staged copy is fixed before its first commit so it extracts on any OS:
- rename the 50 Windows-illegal names (replace `: ? " | * < >` with `-`), record old->new in `RENAMES.tsv`;
- resolve case collisions (`Memoir` -> `memoir`, keep both files with suffix when contents differ);
- flatten paths over 200 chars by shortening the deepest directory names, logged in `RENAMES.tsv`.
`MANIFEST.sha256` is written after renaming; `RENAMES.tsv` maps back to source paths so the receipt still ties target hash to source hash.

### Order

0. Kyle runs Part A locally (independent, no repo changes).
1. `--private-archive` flag + tests (done, this branch).
2. Kyle creates the 5 empty private repos on GitHub (outward-facing, his action) and enables "Include Git LFS objects in archives" on `abstrekkt-media`.
3. Per repo: dry-run, copy, clean-name pass, `sha256sum -c`, first commit, push, receipt.
4. Kyle downloads one new repo as ZIP and confirms it opens.

## Verification

- `python -m unittest discover -s tests -p 'test_extraction_boundary.py'` passes (13 tests, verified 2026-10-21).
- `python scripts/repo_integrity.py --base <base-sha>` currently crashes with `NameError: check_tracked_ignored` on `main` too (pre-existing, not caused by this change); fix separately, then re-run.
- Per repo: `sha256sum -c MANIFEST.sha256` passes; `git ls-files | grep -cE '[<>:"|?*]'` = 0; no case-duplicate paths; no path >200 chars; zip of `main` downloaded and extracted on Windows without errors.
- Receipt in `docs/migrations/<repo>/` has all 9 required fields filled.

## Open items for Kyle

- Credential rotation (`02-SECRET-ROTATION-RUNBOOK.md`) is still listed as not done; it blocks deploys, not these private copies.
- Whether `abstrekkt` itself gets slimmed after receipts exist (separate approval).
