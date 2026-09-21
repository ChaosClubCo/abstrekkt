# SEO & Performance Optimization Guide

## On-Page SEO

### Meta Tags Template
```html
<title>Page Title (50-60 chars) | FlashFusion Studio</title>
<meta name="description" content="150-155 character description with primary keyword" />
<link rel="canonical" href="https://flashfusion.com/page" />
```

### Open Graph
```html
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Description" />
<meta property="og:image" content="https://flashfusion.com/og-image.jpg" />
<meta property="og:url" content="https://flashfusion.com/page" />
<meta property="og:type" content="website" />
```

## Structured Data (JSON-LD)

### Organization
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FlashFusion Studio",
  "url": "https://flashfusion.com",
  "logo": "https://flashfusion.com/logo.png"
}
```

### Article (Blog Posts)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "author": { "@type": "Person", "name": "Author Name" },
  "datePublished": "2025-11-18",
  "image": "cover.jpg"
}
```

## Core Web Vitals Optimization

### LCP (<2.5s)
- Preload hero image: `<link rel="preload" as="image" href="/hero.jpg" />`
- Use Next/Image with priority flag
- Optimize font loading: font-display: swap

### CLS (<0.1)
- Set explicit width/height on images
- Reserve space for ads/dynamic content
- Use CSS aspect-ratio

### INP (<200ms)
- Limit long tasks
- Use React.useTransition for heavy updates
- Code-split with dynamic imports

## Image Optimization

### Format Strategy
1. AVIF (best compression, modern browsers)
2. WebP fallback (wide support)
3. JPEG/PNG (legacy)

### Responsive Images
```jsx
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
/>
```

## Caching Strategy

### Static Assets
- Max-age: 1 year
- Immutable flag
- Content-hash in filename

### HTML
- No-cache or short TTL (60s)
- Use ISR for data-driven pages

### API Routes
- Per-endpoint caching
- CDN edge caching where possible

## Performance Budget

| Metric | Target |
|--------|--------|
| Lighthouse Performance | â‰¥90 |
| LCP | <2.5s |
| CLS | <0.1 |
| INP | <200ms |
| Bundle Size | <200KB |

---

**Tools:** Lighthouse CI, WebPageTest, Chrome DevTools
