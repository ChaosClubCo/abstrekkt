---
name: production-graphics
description: Create export-ready graphics for web, print, and social media with proper formats, color spaces, resolution, and optimization. Use when preparing assets for production, creating marketing materials, or exporting designs from Figma/Sketch.
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
<!-- Export 3 sizes: 1x, 2x, 3x -->
<picture>
  <!-- Modern browsers -->
  <source 
    srcset="image-800.webp 800w,
            image-1200.webp 1200w,
            image-1600.webp 1600w"
    type="image/webp"
  />
  
  <!-- Fallback -->
  <img 
    srcset="image-800.jpg 800w,
            image-1200.jpg 1200w,
            image-1600.jpg 1600w"
    sizes="(max-width: 768px) 100vw,
           (max-width: 1200px) 50vw,
           800px"
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
# 1. Export from design tool at 2x-3x resolution
# Figma: Select layer → Export → 2x, 3x

# 2. Convert to WebP
cwebp -q 80 image@2x.png -o image@2x.webp

# 3. Optimize JPEG fallback
jpegoptim --max=85 --strip-all image@2x.jpg

# 4. Optimize PNG (if needed)
pngquant --quality=80-90 image@2x.png

# 5. Generate srcset variants (800px, 1200px, 1600px)
convert image@2x.jpg -resize 800x image-800.jpg
convert image@2x.jpg -resize 1200x image-1200.jpg
convert image@2x.jpg -resize 1600x image-1600.jpg
```

Run: `scripts/optimize-images.sh <directory>` to batch process

**Web graphics checklist:**

- [ ] Format optimized (WebP with JPEG/PNG fallback)
- [ ] File size <200KB (photos), <150KB (graphics)
- [ ] Responsive variants exported (1x, 2x, 3x)
- [ ] Color space: sRGB (not CMYK or Display P3)
- [ ] Dimensions match design specs exactly
- [ ] Alt text prepared for accessibility
- [ ] lazy loading enabled (loading="lazy")

See: references/web-optimization.md

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
# Convert RGB to CMYK using ImageMagick
convert input.png -colorspace CMYK -profile USWebCoatedSWOP.icc output.tif

# Or in Photoshop:
# Edit → Convert to Profile → Destination: Coated FOGRA39 (or US Web Coated)
```

**IMPORTANT: RGB vs CMYK**
- **RGB** (Red, Green, Blue) - Digital screens (web, mobile, TV)
- **CMYK** (Cyan, Magenta, Yellow, Black) - Print (offset, digital printing)
- **Conversion causes color shift** - Always preview CMYK before print

**Print-ready PDF export (Figma/Illustrator/InDesign):**

```
Settings:
- Standard: PDF/X-1a:2001 (most compatible with printers)
- Color mode: CMYK
- Bleed: 3mm (business cards, flyers) or 5mm (posters)
- Crop marks: Include if printer requests
- Resolution: 300 DPI for images
- Fonts: Embed all fonts or convert to outlines
- Transparency: Flatten (to avoid printing issues)
```

**Bleed explained:**
```
Final size: 90mm × 50mm (business card)
+ Bleed: 3mm on all sides
= Export size: 96mm × 56mm

[ 3mm bleed ][ 90mm card area ][ 3mm bleed ]
              [ Safe area: 84mm (3mm margin from trim) ]
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

See: references/print-specifications.md

### Step 3: Social Media Graphics

**Platform specifications (2025):**

| Platform | Profile | Cover/Banner | Post | Story |
|----------|---------|--------------|------|-------|
| **Instagram** | 320×320px | - | 1080×1080px (1:1)<br>1080×1350px (4:5) | 1080×1920px (9:16) |
| **Facebook** | 180×180px | 820×312px | 1200×630px (1.91:1) | 1080×1920px (9:16) |
| **Twitter/X** | 400×400px | 1500×500px | 1200×675px (16:9) | - |
| **LinkedIn** | 400×400px | 1584×396px | 1200×627px (1.91:1) | - |
| **YouTube** | 800×800px | 2560×1440px | 1280×720px (thumbnail) | - |
| **TikTok** | 200×200px | - | - | 1080×1920px (9:16) |

**Aspect ratios:**
- **1:1 (Square)** - Instagram, Facebook, LinkedIn posts
- **4:5 (Portrait)** - Instagram feed
- **9:16 (Story)** - Instagram, Facebook, TikTok Stories
- **16:9 (Landscape)** - YouTube, Twitter, landscape posts

**Export settings:**
```
Format: JPEG (photos) or PNG (graphics with text)
Color space: sRGB
Quality: 90-95% (social platforms compress anyway)
Max file size:
  - Instagram: 30MB (photo), 4GB (video)
  - Facebook: 100MB
  - Twitter: 5MB (photo)
  - LinkedIn: 10MB
```

**Text legibility on mobile:**
```
Minimum font size: 40px (at export resolution)
Max line length: 40 characters
High contrast: Text should pass WCAG AA (4.5:1)
Safe zones: Keep text 10% from edges (platforms crop)
```

**Social media checklist:**

- [ ] Dimensions match platform specs exactly
- [ ] Text readable on mobile (≥40px font at export size)
- [ ] Safe zones respected (10% margin from edges)
- [ ] High contrast for text (≥4.5:1)
- [ ] File size under platform limits
- [ ] Format: JPEG (photos) or PNG (graphics)
- [ ] Color space: sRGB
- [ ] Preview on mobile device before posting

See: references/social-media-templates.md

### Step 4: Vector Graphics (SVG/Icons)

**SVG optimization:**

```bash
# 1. Export from design tool
# Figma: Select → Export → SVG
# Illustrator: File → Export → SVG → Styling: Presentation Attributes

# 2. Optimize with SVGO
npx svgo icon.svg

# Result: Removes comments, metadata, unnecessary attributes
# Size reduction: 30-70%
```

**SVG best practices:**

```xml
<!-- ✅ GOOD: Clean, optimized SVG -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/>
</svg>

<!-- ❌ BAD: Bloated SVG with inline styles, IDs -->
<svg id="Layer_1" style="enable-background:new 0 0 24 24;">
  <g id="Group_1">
    <path id="Path_1" style="fill:#000000;" d="..."/>
  </g>
</svg>
```

**Icon sizing:**
- **Web icons:** 16px, 20px, 24px, 32px (standard sizes)
- **Logo:** Scalable (SVG preferred), provide PNG at 2x, 3x for fallback
- **Favicons:** 16×16px, 32×32px, 48×48px, 64×64px (PNG or ICO)

**Favicon export:**

```bash
# Generate multi-size favicon.ico
convert logo.png -resize 16x16 favicon-16.png
convert logo.png -resize 32x32 favicon-32.png
convert logo.png -resize 48x48 favicon-48.png
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico

# Also export for modern browsers
cp logo.svg favicon.svg # Scalable favicon (Safari, Chrome)
```

**Icon checklist:**

- [ ] SVG optimized with SVGO (<10KB)
- [ ] viewBox set correctly (e.g., "0 0 24 24")
- [ ] No embedded fonts or raster images
- [ ] Colors use currentColor (inherit from CSS)
- [ ] Accessible (use aria-label or <title>)
- [ ] Multi-size PNGs exported (16px, 24px, 32px)

See: references/icon-guidelines.md

### Step 5: Logo Export (Multi-Format)

**Export checklist for brand logos:**

```
Primary logo files:
├── logo.svg (scalable, for web)
├── logo.png (transparent, 1000px wide, 2x resolution)
├── logo@2x.png (2000px wide, 3x resolution)
├── logo-white.svg (reverse logo for dark backgrounds)
├── logo-white.png (transparent, 1000px wide)
├── logo-black.svg (single-color version)
└── logo-black.png (transparent, 1000px wide)

Print files:
├── logo-cmyk.eps (vector, CMYK, for print)
├── logo-cmyk.pdf (PDF/X-1a, CMYK, 300 DPI)
└── logo-pantone.ai (spot colors for branded materials)

Favicon:
├── favicon.ico (16×16, 32×32, 48×48 multi-size)
└── favicon.svg (scalable favicon for modern browsers)

Social media:
├── logo-square.png (1080×1080px for profile pictures)
└── logo-og.png (1200×630px for Open Graph preview)
```

**Clear space (logo breathing room):**
```
Minimum clear space: Height of logo "X" (e.g., capital letter height)

     [X-height space]
[X]  ┌─────────────┐
     │    LOGO     │
     └─────────────┘
     [X-height space]
```

**Minimum sizes:**
- **Print:** 20mm width (business card)
- **Web:** 120px width (header logo)
- **Mobile:** 80px width (minimum readable)

See: references/logo-export-guide.md

## Advanced Techniques

### Retina/HiDPI Export

**Export at 2x-3x resolution for sharp displays:**

```
Design size: 400×300px
Export sizes:
- 1x: 400×300px (standard displays)
- 2x: 800×600px (Retina MacBook, iPhone)
- 3x: 1200×900px (Retina iPad, high-DPI Android)
```

**CSS for Retina images:**

```css
.logo {
  width: 200px;
  height: 150px;
  background-image: url('logo@1x.png');
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .logo {
    background-image: url('logo@2x.png');
  }
}
```

### Color Profiles

**Embed correct color profiles:**

| Profile | Use Case |
|---------|----------|
| sRGB IEC61966-2.1 | Web, digital screens (default) |
| Display P3 | Modern Apple devices (wider gamut) |
| Adobe RGB (1998) | Photography, high-end print |
| Coated FOGRA39 | Coated paper (Europe) |
| US Web Coated (SWOP) v2 | Coated paper (USA) |

**Convert profiles:**

```bash
# Embed sRGB for web
convert input.png -profile sRGB-IEC61966-2.1.icc output.png

# Convert RGB to CMYK for print
convert input.png -profile sRGB.icc -profile CoatedFOGRA39.icc -colorspace CMYK output.tif
```

### Compression Comparison

**Lossy vs lossless:**

| Method | Formats | Quality | Size Reduction | Use Case |
|--------|---------|---------|----------------|----------|
| Lossy | JPEG, WebP | Slight degradation | 70-90% | Photos, complex images |
| Lossless | PNG, WebP (lossless) | Perfect | 20-50% | Graphics, logos, screenshots |

**Compression tools:**

```bash
# JPEG (lossy)
jpegoptim --max=85 --strip-all photo.jpg

# PNG (lossless)
pngquant --quality=80-90 screenshot.png
optipng -o7 screenshot.png

# WebP (lossy or lossless)
cwebp -q 80 photo.jpg -o photo.webp       # Lossy
cwebp -lossless screenshot.png -o screenshot.webp  # Lossless

# SVG
npx svgo icon.svg
```

## Export Presets

**Figma export presets:**

```javascript
// Web export (2x scale, optimized)
{
  "format": "PNG",
  "scale": 2,
  "constraint": { "type": "WIDTH", "value": 1200 },
  "suffix": "@2x"
}

// Social media (specific dimensions)
{
  "format": "JPG",
  "constraint": { "type": "WIDTH", "value": 1200 },
  "constraint": { "type": "HEIGHT", "value": 630 },
  "suffix": "-og"
}

// Icon export (multiple sizes)
{
  "format": "PNG",
  "scale": [1, 2, 3],
  "constraint": { "type": "WIDTH", "value": 24 },
  "suffix": ["", "@2x", "@3x"]
}
```

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

Run: `scripts/export-validation.js <directory>` to validate exports

## Bundled Resources

- **scripts/optimize-images.sh** - Batch image optimization (JPEG, PNG, WebP)
- **scripts/export-validation.js** - Validate export specs (resolution, color space, size)
- **scripts/generate-favicons.sh** - Multi-size favicon generator
- **scripts/batch-resize.sh** - Generate srcset variants
- **references/web-optimization.md** - Complete web graphics guide
- **references/print-specifications.md** - Print specs by material type
- **references/social-media-templates.md** - All platform specs + templates
- **references/icon-guidelines.md** - Icon design and export standards
- **references/logo-export-guide.md** - Complete logo delivery package
- **references/automation-scripts.md** - Figma/Sketch export automation
- **assets/color-profiles/** - ICC profiles (sRGB, CMYK, Display P3)
- **assets/export-presets/** - Figma, Sketch, Illustrator presets
