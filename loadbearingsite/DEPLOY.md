# Deploy Load-Bearing (static site)

13 essays + an index. Pure static HTML/CSS — no build step, no dependencies.
The whole `site/` folder is the site. `index.html` is the home page; each
`essay-NN-*.html` is a standalone page it links to.

## Fastest paths to a live URL

**Cloudflare Pages (recommended — you already use Cloudflare)**
1. Go to Cloudflare Pages → Create → Upload assets (or connect a Git repo).
2. Drag the whole `site/` folder in. No build command; output dir = `/`.
3. Add a custom domain: `load-bearing.flashfusion.co` (or point `abstrekkt.com`).
   DNS is a single CNAME Cloudflare walks you through.

**Vercel**
1. `vercel` in the `site/` folder, or drag-drop the folder in the dashboard.
2. Framework preset: "Other" (static). No build command.
3. Add the domain in Project → Settings → Domains.

**Netlify**
1. Drag the `site/` folder onto app.netlify.com/drop — live instantly on a
   `*.netlify.app` URL.
2. Add your custom domain under Domain settings.

**GitHub Pages**
1. Push `site/` to a repo, enable Pages on the `main` branch root.
2. Add the custom domain in Pages settings (writes a CNAME file).

## Domain note

Every essay footer and the index link to `flashfusion.co`, and the masthead is
"Load-Bearing" (a FlashFusion property). `load-bearing.flashfusion.co` keeps that
consistent. If you'd rather sit it on `abstrekkt.com`, it's a DNS change only —
no file edits needed, but consider updating the footer links for brand match.

## What is NOT here (by design)

- No email capture / subscribe form. Add one later (Buttondown, ConvertKit,
  Beehiiv embed) once the destination exists — the destination is what unblocks
  your press pitches, the list can follow.
- Post 4 was cut (day-job lane). The arc is a clean 1–13.
- Analytics: drop your PostHog snippet into each page's `<head>` if you want it
  (you already have a PostHog project).
