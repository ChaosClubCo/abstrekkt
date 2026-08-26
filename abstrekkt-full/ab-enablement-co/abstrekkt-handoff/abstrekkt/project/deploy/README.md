# Deploy — kyle.abstrekkt.com

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

## Kyle's steps (nothing here is automatable from the workspace)

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
