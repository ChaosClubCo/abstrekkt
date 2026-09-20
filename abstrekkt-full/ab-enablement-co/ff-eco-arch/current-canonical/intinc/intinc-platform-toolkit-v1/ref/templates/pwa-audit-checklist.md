# PWA Audit Checklist

## Pre-Launch
- [ ] Web App Manifest complete (name, short_name, icons, theme_color, background_color, display, start_url)
- [ ] Icons: 192x192 + 512x512 (+ maskable)
- [ ] Service worker registered and caching app shell
- [ ] Offline fallback page exists
- [ ] HTTPS enabled
- [ ] Redirects HTTP → HTTPS

## Performance
- [ ] LCP < 2.5s
- [ ] FID / INP < 200ms
- [ ] CLS < 0.1
- [ ] JS bundle < 200KB gzipped
- [ ] Images lazy-loaded and optimized (WebP/AVIF)
- [ ] Font loading optimized (display: swap)
- [ ] Critical CSS inlined

## Caching Strategy
- [ ] App shell: Cache-First
- [ ] API data: Stale-While-Revalidate or Network-First
- [ ] Images: Cache-First with expiration
- [ ] Fonts: Cache-First (1 year)
- [ ] HTML: Network-First with 3s timeout

## Push Notifications
- [ ] VAPID keys generated and configured
- [ ] Subscription endpoint secured
- [ ] Notification permission requested contextually (not on page load)
- [ ] Notification click handler opens correct URL
- [ ] Stale subscriptions pruned on 404/410

## Security
- [ ] CSP headers set
- [ ] No inline scripts without nonce
- [ ] Service worker scope limited to app path
- [ ] No sensitive data in cache
- [ ] Cache versioning strategy defined

## Lighthouse Scores
- [ ] PWA: 90+
- [ ] Performance: 85+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 90+
