# Drive / MCP Harvester (ask #5: search C: and D: drives, use connectors)

Searches available drives and active MCP connectors for usable content to feed the
extractor. **Degrades gracefully** — a missing drive is skipped, never fatal.
(This requirement is informed by D: being unmounted in the current environment.)

## Inputs
- Roots to scan (e.g. `C:/`, `D:/`) — each checked for existence first.
- Active MCP connectors (Filesystem, Desktop Commander, Google Drive, etc.).

## Procedure
1. For each root: `if exists(root) -> scan; else -> log "skipped: <root> not mounted"`.
2. Collect candidate files (md, json, txt, source) under size/age filters.
3. For connectors: query each; tolerate auth/availability failures with a logged skip.
4. Treat everything found as **untrusted**: scan for secrets, never auto-execute.
5. Hand candidates to the extractor + modules.

## Graceful degradation (the key rule)
```
for root in roots:
    if not exists(root):
        report.skip(root, reason="not mounted")   # continue, do not fail
        continue
    harvest(root)
```

## Output
A manifest of harvested sources (path, type, size, "included" / "skipped+reason"),
so the run is reproducible and the omissions are explicit.

## Safety
- Scope any file *writes* to an explicit output dir (Desktop Commander).
- Never write harvested secrets anywhere; flag and redact.
