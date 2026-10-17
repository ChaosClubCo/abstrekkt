# Deploy — abstrekkt.com root + kyle.abstrekkt.com

## abstrekkt.com (root)

**Deploy the contents of `abstrekkt-com/` through the exact-SHA Cloudflare Pages release workflow.**
Everything in that folder is generated from the four studio canonicals
(`Abstrekkt Home.html`, `Abstrekkt Founder.html`, `Abstrekkt Pillars.html`,
`Abstrekkt Contact.html`) with `image-slot` tooling stripped and cross-page links made
root-relative. Never edit the generated page copies directly — edit the canonicals, then regenerate.

The release workflow also generates crawler-discovery assets in the release workspace so they stay
synchronized with the public page tree without hand-editing generated deploy output:

- `/sitemap.xml` — Sitemaps-protocol XML generated from every public `index.html` route under the static package.
- `/robots.txt` — permits public crawling and contains `Sitemap: https://abstrekkt.com/sitemap.xml`.
- Cloudflare response headers explicitly serve the sitemap as `application/xml; charset=utf-8` and robots as `text/plain; charset=utf-8`.
- The release fails if the sitemap is malformed, contains non-canonical locations, omits the required root/founder/pillars/contact routes after deployment, or if the live robots file does not reference the canonical sitemap.

| File | Live URL |
|---|---|
| `index.html` | abstrekkt.com |
| `founder/index.html` | abstrekkt.com/founder/ |
| `pillars/index.html` | abstrekkt.com/pillars/ |
| `contact/index.html` | abstrekkt.com/contact/ |
| release-generated `sitemap.xml` | abstrekkt.com/sitemap.xml |
| release-generated `robots.txt` | abstrekkt.com/robots.txt |
| `abstrekkt/nav-toggle.js` | shared mobile-nav script, loaded by all four pages |
| `404.html` | any bad URL |

### Discoverability validation

After a production release, verify:

1. `https://abstrekkt.com/sitemap.xml` returns HTTP 200 and valid XML.
2. Every public page is represented by a canonical `<url><loc>` entry.
3. `https://abstrekkt.com/robots.txt` contains exactly the canonical sitemap directive.
4. Run the Agent Ready scan for `https://abstrekkt.com` and require the sitemap discoverability check to pass before treating discoverability as release-certified.

Because the sitemap is generated from the deployed public `index.html` tree on every exact-SHA release,
newly published routes are automatically included and removed routes disappear automatically. Humans
therefore do not have to remember to update XML by hand, an arrangement broadly preferable to relying
on human memory for repetitive publishing bookkeeping.

## kyle.abstrekkt.com

**Upload the contents of `kyle-abstrekkt-com/` to a static host. That is the whole deploy.**
Everything in that folder is generated from the three root canonicals
(`kyle-abstrekkt-index.html`, `playbook.html`, `press-kit.html`) with the in-project
design tooling stripped (Tweaks panel, React/Babel, image-slot). Never edit the copies —
edit the canonicals, then regenerate.

## Folder → URL

| File | Live URL |
|---|---|
| `index.html` | kyle.abstrekkt.com |
| `playbook/index.html` | kyle.abstrekkt.com/playbook |
| `press/index.html` | kyle.abstrekkt.com/press |
| `404.html` | any bad URL (Pages hosts pick this up automatically) |

Links between pages are root-relative (`/`, `/playbook`, `/press`), so they work on the
live domain **and** on any staging preview URL — but not when opening the files from disk.

## Kyle's steps for kyle.abstrekkt.com

1. **Pick a host** — Cloudflare Pages, Netlify, or GitHub Pages. All three serve this
   folder as-is with clean URLs. Cloudflare Pages is the least-friction choice if DNS
   for abstrekkt.com is already on Cloudflare.
2. **Upload** the `kyle-abstrekkt-com/` folder (drag-and-drop deploy is fine; no build step).
3. **DNS** — add a `CNAME` record: `kyle` → the host's target for the site
   (e.g. `<project>.pages.dev`). Then add `kyle.abstrekkt.com` as a custom domain in the
   host so it issues the TLS cert.
4. **Mailbox** — `kyle@abstrekkt.com` must actually receive mail before any pitch goes
   out (the press kit promises "checked daily"). Cheapest: Cloudflare Email Routing or
   the registrar's forwarding → personal inbox. Send yourself a test.
5. **Verify** — all three URLs load over https; a bad URL shows the 404; the mailbox test
   arrived.

## What going live unblocks

- **Lee Chong Ming pitch** (hard-gated on a live playbook URL)
- Every one of the 39 pitch signatures already points at kyle.abstrekkt.com
- Launch-order step 2 (properties block on the root) becomes meaningful

## Regenerate when

- Kyle drops the real headshot into `press-kit.html` (the deploy copy currently shows a
  static "photo on request" frame — intentional, no empty drag-drop UI in production)
- Hero copy/accent is changed via the index Tweaks panel (deploy copy has the chosen
  values baked in: forensic voice, full depth, #cf5a32 ember)
- Any edit to the three root canonicals
