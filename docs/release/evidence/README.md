# Release evidence index

Authority domain: `abstrekkt_publication`. Tested revision: `980fe6fa66ce5d329ae566b3f7d6c0b947c1eb70`. Comparison base: `d981a1d9c882640b60cb64003def0b14f897328f`.
This indexes the evidence captured for `../RELEASE_CHECKLIST.md`. Not every PASS row cites a file here: some (for example R-PRIV-01, R-DOC-01) rest on source behaviour or runbooks named in the row itself.

| File | What it shows | Captured (UTC) |
| --- | --- | --- |
| `validation-run.txt` | Every local check command and its exit code / test counts, on a clean tree at `980fe6fa` | 2026-10-15T20:15:38Z |
| `validation-run-2026-10-09-working-tree.txt` | Superseded first run on `d981a1d9` + uncommitted changes; kept only for the R-CI-01 repo-integrity observation | 2026-10-09T18:44:12Z |
| `live-observations-2026-10-09.md` | Production read-only observations O1–O4 and CI run IDs | 2026-10-09T18:38:50Z–18:44:12Z |
| `live-headers-pages-dev-2026-10-09.txt` | Raw response headers: production Pages alias vs certified deployment | 2026-10-09T18:39:12Z |
| `readback-abstrekkt-pages-dev-2026-10-09.json` | `pages_probe.py readback` against `abstrekkt.pages.dev` (FAIL: 2 header checks) | within 2026-10-09T18:38:50Z–18:44:12Z |
| `apex-preflight-2026-10-09.json` | `pages_probe.py apex --phase preflight` against `abstrekkt.com` (REACHABLE) | within 2026-10-09T18:38:50Z–18:44:12Z |
| `../../../evidence/releases/abstrekkt/2026-08-26-e1d3355-release-receipt.json` | Last CERTIFIED release receipt (historical; superseded by the ungoverned deployment in O1) | 2026-08-27 |

No file here contains a credential value. Cloudflare ray IDs are request identifiers, not secrets.
