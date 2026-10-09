# Release evidence index

Authority domain: `abstrekkt_publication`. Base revision: `d981a1d9c882640b60cb64003def0b14f897328f`.
Every PASS in `../RELEASE_CHECKLIST.md` cites one of these files, a CI run ID, or an existing receipt.

| File | What it shows | Captured (UTC) |
| --- | --- | --- |
| `validation-run.txt` | Every local check command and its exit code / test counts | 2026-10-09T18:44:12Z |
| `live-observations-2026-10-09.md` | Production read-only observations O1–O4 and CI run IDs | 2026-10-09T18:38:50Z–18:44:12Z |
| `live-headers-pages-dev-2026-10-09.txt` | Raw response headers: production Pages alias vs certified deployment | 2026-10-09T18:39:12Z |
| `readback-abstrekkt-pages-dev-2026-10-09.json` | `pages_probe.py readback` against `abstrekkt.pages.dev` (FAIL: 2 header checks) | within 2026-10-09T18:38:50Z–18:44:12Z |
| `apex-preflight-2026-10-09.json` | `pages_probe.py apex --phase preflight` against `abstrekkt.com` (REACHABLE) | within 2026-10-09T18:38:50Z–18:44:12Z |
| `../../../evidence/releases/abstrekkt/2026-08-26-e1d3355-release-receipt.json` | Last CERTIFIED release receipt (historical; superseded by the ungoverned deployment in O1) | 2026-08-27 |

No file here contains a credential value. Cloudflare ray IDs are request identifiers, not secrets.
