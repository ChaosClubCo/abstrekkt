---
name: producing-graphics
description: Create and export production-ready graphics for web, print, and social with correct formats, color spaces, resolution, and optimization. Use when preparing assets, exporting from Figma/Sketch, converting to WebP, generating srcset, building favicons, packaging logos, or producing print-ready PDF/X-1a (CMYK + bleed). Triggers on: export graphic, resize for social, Instagram size, Facebook banner, SVG optimize, retina export, print-ready PDF.
metadata:
  version: "1.1.0"
---

# Production Graphics

Prepare export-ready graphics with proper formats, optimization, and specs for web, print, and social media.

## Quick Start Decision Tree

**Choose workflow based on output medium:**

1. **Web graphics?** → Web Export (Step 1)
2. **Print materials?** → Print Export (Step 2)
3. **Social media?** → Social Media Specs (Step 3)
4. **Icons/logos?** → Vector Export (Step 4)
5. **Batch export?** → See references/automation-scripts.md

## Core Workflow

### Step 1: Web Graphics Export

**Image format decision tree:**

```
Is it a photograph/complex image?
├─ Yes → Use JPEG (or WebP with JPEG fallback)
│  └─ Quality: 80-85% (balance size/quality)
└─ No → Is it a simple graphic/logo?
   ├─ Yes → Use SVG (scalable, small file size)
   └─ No → Does it need transparency?
      ├─ Yes → Use PNG-24 (or WebP with PNG fallback)
      └─ No → Use JPEG
```

**Export specifications:**

| Format | Use Case | Settings | Max Size |
|--------|----------|----------|----------|
| JPEG | Photos, complex images | Quality 80-85%, progressive | <200KB |
| PNG-24 | Transparency, screenshots | 8-bit transparency | <150KB |
| WebP | Modern browsers (photos) | Quality 80% | <150KB |
| SVG | Icons, logos, illustrations | Minified, no embedded fonts | <50KB |
| GIF | Avoid (use video or WebP) | - | - |

**Responsive images (srcset):**

```html
<picture>
  <source
    srcset="image-800.webp 800w, image-1200.webp 1200w, image-1600.webp 1600w"
    type="image/webp"
  />
  <img
    srcset="image-800.jpg 800w, image-1200.jpg 1200w, image-1600.jpg 1600w"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
    src="image-800.jpg"
    alt="Description"
    loading="lazy"
    width="800"
    height="600"
  />
</picture>
```

**Image optimization workflow:**

```bash
# Export from design tool at 2x-3x resolution
cwebp -q 80 image@2x.png -o image@2x.webp
jpegoptim --max=85 --strip-all image@2x.jpg
pngquant --quality=80-90 image@2x.png

# Generate srcset variants
convert image@2x.jpg -resize 800x image-800.jpg
convert image@2x.jpg -resize 1200x image-1200.jpg
convert image@2x.jpg -resize 1600x image-1600.jpg
```

**Web graphics checklist:**

- [ ] Format optimized (WebP with JPEG/PNG fallback)
- [ ] File size <200KB (photos), <150KB (graphics)
- [ ] Responsive variants exported (1x, 2x, 3x)
- [ ] Color space: sRGB (not CMYK or Display P3)
- [ ] Dimensions match design specs exactly
- [ ] Alt text prepared for accessibility
- [ ] lazy loading enabled (loading="lazy")

### Step 2: Print Graphics Export

**Print specifications:**

| Item | Resolution | Color Mode | Format | Bleed |
|------|------------|------------|--------|-------|
| Business card | 300 DPI | CMYK | PDF/X-1a | 3mm |
| Poster | 150-300 DPI | CMYK | PDF/X-1a | 5mm |
| Banner | 100-150 DPI | CMYK | PDF/X-1a | 10mm |
| Magazine ad | 300 DPI | CMYK | PDF/X-1a | 3mm |
| Book cover | 300 DPI | CMYK | PDF/X-1a | 3mm |

**DPI guidelines:**
- **High-quality print:** 300 DPI (magazines, brochures)
- **Large format (posters, banners):** 150 DPI (viewed from distance)
- **Billboards:** 72-100 DPI (viewed from far away)

**Color space conversion (RGB → CMYK):**

```bash
convert input.png -colorspace CMYK -profile USWebCoatedSWOP.icc output.tif
```

**IMPORTANT: RGB vs CMYK**
- **RGB** — Digital screens (web, mobile, TV)
- **CMYK** — Print (offset, digital printing)
- **Conversion causes color shift** — Always preview CMYK before print

**Print-ready PDF export settings:**

```
Standard: PDF/X-1a:2001
Color mode: CMYK
Bleed: 3mm (business cards, flyers) or 5mm (posters)
Resolution: 300 DPI for images
Fonts: Embed all fonts or convert to outlines
Transparency: Flatten
```

**Print graphics checklist:**

- [ ] Resolution: 300 DPI (150 DPI for large format)
- [ ] Color mode: CMYK (Coated FOGRA39 or US Web Coated)
- [ ] Format: PDF/X-1a (or TIFF/EPS if required)
- [ ] Bleed: 3-5mm extended background
- [ ] Safe area: 3mm margin from trim edge (no critical text)
- [ ] Fonts: Embedded or converted to outlines
- [ ] Black: Use rich black (C:60 M:40 Y:40 K:100), not pure black (K:100)
- [ ] File size: <50MB (for email delivery)

### Step 3: Social Media Graphics

**Platform specifications (2026):**

| Platform | Profile | Post (primary) | Story / Vertical |
|----------|---------|----------------|------------------|
| **Instagram** | 320×320px | **1080×1350px (4:5 portrait — Meta-preferred 2026)** / 1080×1080px (1:1) | 1080×1920px |
| **Facebook** | 180×180px | 1080×1350px (4:5) / 1200×630px (link preview) | 1080×1920px |
| **Twitter/X** | 400×400px | 1200×675px (16:9) | — |
| **LinkedIn** | 400×400px | 1200×1200px (1:1 feed) / 1200×627px (link) / banner 1584×396px | — |
| **YouTube** | 800×800px | 1280×720px (thumbnail) | 1080×1920px (Shorts) |
| **TikTok** | 200×200px | — | **1080×1920px (9:16 — required)** |

**2026 changes worth noting:**
- Meta (Instagram + Facebook) prioritizes 4:5 portrait over 1:1 square in the feed algorithm.
- WebP is accepted on most major platforms; JPEG remains the safest universal fallback.
- Vertical 9:16 is mandatory for TikTok and dominant for Reels / Shorts.

**Export settings:**

```
Format: JPEG (photos) or PNG (graphics with text)
Color space: sRGB
Quality: 90-95%
Min font size: 40px at export resolution
Safe zones: Keep text 10% from edges
```

**Social media checklist:**

- [ ] Dimensions match platform specs exactly
- [ ] Text readable on mobile (≥40px font at export size)
- [ ] Safe zones respected (10% margin from edges)
- [ ] High contrast for text (≥4.5:1 WCAG AA)
- [ ] File size under platform limits
- [ ] Color space: sRGB
- [ ] Preview on mobile device before posting

### Step 4: Vector Graphics (SVG/Icons)

**SVG optimization:**

```bash
npx svgo icon.svg
# Removes comments, metadata, unnecessary attributes
# Size reduction: 30-70%
```

**SVG best practices:**

```xml
<!-- GOOD: Clean, optimized SVG -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
</svg>
```

**Icon sizing:**
- **Web icons:** 16px, 20px, 24px, 32px (standard sizes)
- **Logo:** Scalable (SVG preferred), provide PNG at 2x, 3x for fallback
- **Favicons:** 16×16px, 32×32px, 48×48px, 64×64px (PNG or ICO)

**Favicon export:**

```bash
convert logo.png -resize 16x16 favicon-16.png
convert logo.png -resize 32x32 favicon-32.png
convert logo.png -resize 48x48 favicon-48.png
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico
```

**Icon checklist:**

- [ ] SVG optimized with SVGO (<10KB)
- [ ] viewBox set correctly (e.g., "0 0 24 24")
- [ ] No embedded fonts or raster images
- [ ] Colors use currentColor (inherit from CSS)
- [ ] Accessible (use aria-label or title element)
- [ ] Multi-size PNGs exported (16px, 24px, 32px)

### Step 5: Logo Export (Multi-Format)

**Complete logo delivery package:**

```
Primary logo files:
├── logo.svg
├── logo.png (1000px wide, transparent)
├── logo@2x.png (2000px wide)
├── logo-white.svg / logo-white.png
├── logo-black.svg / logo-black.png

Print files:
├── logo-cmyk.eps (vector, CMYK)
├── logo-cmyk.pdf (PDF/X-1a, 300 DPI)

Favicon:
├── favicon.ico (16×16, 32×32, 48×48 multi-size)
└── favicon.svg

Social media:
├── logo-square.png (1080×1080px)
└── logo-og.png (1200×630px for Open Graph)
```

**Minimum sizes:**
- **Print:** 20mm width
- **Web:** 120px width
- **Mobile:** 80px width

## Quality Gates

Before delivery:

- [ ] Correct format for use case (web: WebP/JPEG/PNG, print: PDF/EPS)
- [ ] Proper color space (web: sRGB, print: CMYK)
- [ ] Resolution matches specs (web: 2x-3x, print: 300 DPI)
- [ ] File size optimized (<200KB web, <50MB print)
- [ ] Multiple formats provided (SVG + PNG fallback for logos)
- [ ] Responsive variants exported (srcset for web)
- [ ] Bleed included (print only)
- [ ] Fonts embedded or outlined (print)
- [ ] Safe zones respected (social media, print)
- [ ] Preview on target medium (screen, printed proof)
