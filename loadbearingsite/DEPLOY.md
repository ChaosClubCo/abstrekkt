# Deploy Load-Bearing (static site)

13 essays + an index. Pure static HTML/CSS — no build step, no dependencies.
The whole `site/` folder is the site. `index.html` is the home page; each
`essay-NN-*.html` is a standalone page it links to.

## Fastest paths to a live URL

**Cloudflare Pages (recommended — you already use Cloudflare)**
1. Go to Cloudflare Pages → Create → Upload assets (or connect a Git repo).
2. Drag the whole `site/` folder in. No build command; output dir = `/`.
3. Add the custom domain: `blog.abstrekkt.com`.
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

## Domain decision — July 27, 2026

Founder-approved destination: `blog.abstrekkt.com`. The broader writing property
will contain Load-Bearing alongside the Kyle Rosebrook essay corpus. Do not deploy
this package to `load-bearing.flashfusion.co` or the `abstrekkt.com` root.

Before launch, update essay footer and canonical links so they resolve consistently
under `blog.abstrekkt.com`; then run a link check across the full 13-essay package.

## What is NOT here (by design)

- No email capture / subscribe form. Add one later (Buttondown, ConvertKit,
  Beehiiv embed) once the destination exists — the destination is what unblocks
  your press pitches, the list can follow.
- Post 4 was cut (day-job lane). The arc is a clean 1–13.
- Analytics: drop your PostHog snippet into each page's `<head>` if you want it
  (you already have a PostHog project).
