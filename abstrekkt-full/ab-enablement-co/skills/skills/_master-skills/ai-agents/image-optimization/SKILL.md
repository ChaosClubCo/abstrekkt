---
name: image-optimization
description: Helps configure and build image optimization processes. Master image optimization with compression techniques, format selection, responsive image strategies, and performance-focused delivery. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Image Optimization Skill

## Instructions


> Master image optimization with compression techniques, format selection, responsive image strategies, and performance-focused delivery.

## Skill Overview

This skill provides expertise in optimizing images for web and digital platforms. It covers compression techniques, format selection, responsive images, and performance optimization strategies.

## Core Capabilities

### Compression
- Lossy compression
- Lossless compression
- Quality balance
- Batch processing
- Automated pipelines
- Visual quality assessment

### Format Selection
- Format comparison
- Browser support
- Use case matching
- Fallback strategies
- Modern formats (WebP, AVIF)
- Legacy support

### Responsive Images
- srcset implementation
- Art direction
- Lazy loading
- CDN integration
- Breakpoint strategy
- Pixel density handling

## Image Format Guide

### Format Comparison
```yaml
image_formats:
  jpeg:
    extension: ".jpg, .jpeg"
    compression: "Lossy"
    best_for:
      - Photographs
      - Complex images
      - Print-to-web
    not_for:
      - Transparency
      - Graphics/logos
      - Text-heavy images
    quality_settings:
      web_standard: "70-85%"
      high_quality: "85-95%"
      maximum: "95-100%"

  png:
    extension: ".png"
    compression: "Lossless (or lossy with tools)"
    best_for:
      - Graphics with transparency
      - Logos and icons
      - Screenshots
      - Images with text
    not_for:
      - Large photographs
      - When file size is critical
    variants:
      png_8: "256 colors, smaller files"
      png_24: "16M colors, larger files"
      png_32: "24-bit + alpha channel"

  webp:
    extension: ".webp"
    compression: "Lossy or lossless"
    best_for:
      - Modern web delivery
      - Size-critical applications
      - Both photos and graphics
    benefits:
      - 25-35% smaller than JPEG
      - Transparency support
      - Animation support
    browser_support: "95%+ modern browsers"

  avif:
    extension: ".avif"
    compression: "Lossy or lossless"
    best_for:
      - Cutting-edge performance
      - Next-gen optimization
    benefits:
      - 50% smaller than JPEG
      - HDR support
      - Better quality at low bitrates
    browser_support: "~85% modern browsers"

  svg:
    extension: ".svg"
    compression: "None (vector)"
    best_for:
      - Icons
      - Logos
      - Illustrations
      - Responsive graphics
    benefits:
      - Infinite scalability
      - Small file size for simple graphics
      - CSS/JS animation
    not_for:
      - Photographs
      - Complex imagery

  gif:
    extension: ".gif"
    compression: "Lossless (limited colors)"
    best_for:
      - Simple animations
      - Legacy requirements
    limitations:
      - 256 colors max
      - Large file sizes
      - Poor quality for photos
    modern_alternative: "WebP or MP4 for animation"
```

### Format Decision Tree
```yaml
format_selection:
  is_it_a_photo:
    yes:
      needs_transparency:
        yes: "WebP or PNG"
        no:
          modern_browsers_only:
            yes: "AVIF → WebP → JPEG (fallback)"
            no: "WebP → JPEG (fallback)"
    no:
      is_it_animated:
        yes: "WebP or MP4 (not GIF)"
        no:
          is_it_vector_graphics:
            yes: "SVG"
            no:
              has_transparency:
                yes: "WebP or PNG-8/PNG-24"
                no: "WebP or PNG-8"
```

## Compression Techniques

### Quality Settings by Use Case
```yaml
compression_settings:
  hero_images:
    priority: "Quality"
    jpeg_quality: "85-90%"
    webp_quality: "85-90%"
    avif_quality: "80-85%"
    reasoning: "Primary visual, quality matters"

  content_images:
    priority: "Balance"
    jpeg_quality: "75-85%"
    webp_quality: "75-85%"
    avif_quality: "70-80%"
    reasoning: "Good quality, reasonable size"

  thumbnails:
    priority: "Size"
    jpeg_quality: "70-80%"
    webp_quality: "70-80%"
    avif_quality: "65-75%"
    reasoning: "Small display, smaller files"

  background_images:
    priority: "Performance"
    jpeg_quality: "60-75%"
    webp_quality: "60-75%"
    avif_quality: "55-70%"
    reasoning: "Often blurred/overlaid, size matters"
```

### Compression Tools
```yaml
compression_tools:
  online:
    squoosh:
      url: "squoosh.app"
      features:
        - Multiple format support
        - Visual comparison
        - Quality slider
        - Free

    tinypng:
      url: "tinypng.com"
      features:
        - PNG and JPEG
        - Batch processing
        - API available

    imageoptim:
      url: "imageoptim.com"
      features:
        - Mac app + API
        - Multiple algorithms
        - Lossless option

  command_line:
    imagemagick:
      install: "brew install imagemagick"
      example: "convert input.jpg -quality 80 output.jpg"

    cwebp:
      install: "brew install webp"
      example: "cwebp -q 80 input.jpg -o output.webp"

    avifenc:
      install: "brew install libavif"
      example: "avifenc --min 20 --max 40 input.png output.avif"

  automation:
    sharp:
      platform: "Node.js"
      features:
        - Fast processing
        - Multiple formats
        - Resize and compress

    imagemin:
      platform: "Node.js"
      features:
        - Plugin-based
        - Build tool integration
        - Batch processing
```

### Batch Processing Script
```javascript
// Sharp.js example for batch optimization
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImages(inputDir, outputDir) {
  const files = await fs.readdir(inputDir);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const name = path.parse(file).name;

    // Generate WebP
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${name}.webp`));

    // Generate optimized JPEG fallback
    await sharp(inputPath)
      .jpeg({ quality: 85, progressive: true })
      .toFile(path.join(outputDir, `${name}.jpg`));

    // Generate responsive sizes
    const sizes = [400, 800, 1200, 1600];
    for (const width of sizes) {
      await sharp(inputPath)
        .resize(width)
        .webp({ quality: 80 })
        .toFile(path.join(outputDir, `${name}-${width}w.webp`));
    }
  }
}
```

## Responsive Images

### Srcset Implementation
```html
<!-- Basic srcset for different sizes -->
<img
  src="image-800w.jpg"
  srcset="
    image-400w.jpg 400w,
    image-800w.jpg 800w,
    image-1200w.jpg 1200w,
    image-1600w.jpg 1600w
  "
  sizes="(max-width: 600px) 100vw,
         (max-width: 1000px) 50vw,
         800px"
  alt="Description of image"
  loading="lazy"
  decoding="async"
>

<!-- Picture element for art direction + format -->
<picture>
  <!-- AVIF format (modern browsers) -->
  <source
    type="image/avif"
    srcset="
      image-400w.avif 400w,
      image-800w.avif 800w,
      image-1200w.avif 1200w
    "
    sizes="(max-width: 600px) 100vw, 50vw"
  >

  <!-- WebP format (wide support) -->
  <source
    type="image/webp"
    srcset="
      image-400w.webp 400w,
      image-800w.webp 800w,
      image-1200w.webp 1200w
    "
    sizes="(max-width: 600px) 100vw, 50vw"
  >

  <!-- JPEG fallback -->
  <img
    src="image-800w.jpg"
    srcset="
      image-400w.jpg 400w,
      image-800w.jpg 800w,
      image-1200w.jpg 1200w
    "
    sizes="(max-width: 600px) 100vw, 50vw"
    alt="Description"
    loading="lazy"
  >
</picture>
```

### Breakpoint Strategy
```yaml
responsive_breakpoints:
  standard_set:
    mobile: "400w"
    tablet: "800w"
    desktop: "1200w"
    large: "1600w"
    retina: "2x for each"

  sizes_attribute:
    full_width: "(max-width: 600px) 100vw, 100vw"
    half_width: "(max-width: 600px) 100vw, 50vw"
    third_width: "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
    fixed: "800px"

  art_direction:
    when_to_use:
      - Different crops for different sizes
      - Different focal points
      - Portrait vs. landscape
    implementation: "Multiple source elements in picture"
```

### Lazy Loading
```yaml
lazy_loading:
  native:
    implementation: 'loading="lazy"'
    browser_support: "95%+ modern browsers"
    benefits:
      - No JavaScript needed
      - Browser-optimized
      - Simple implementation

  intersection_observer:
    when_to_use:
      - Need more control
      - Custom thresholds
      - Animation on load
    implementation: |
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px' });

  placeholder_strategies:
    low_quality_placeholder:
      - Tiny blurred version (LQIP)
      - Base64 encoded inline
    dominant_color:
      - Extract dominant color
      - Show as background
    skeleton:
      - Gray placeholder
      - Aspect ratio preserved
```

## Performance Optimization

### Optimization Checklist
```yaml
optimization_checklist:
  file_size:
    - [ ] Compressed to optimal quality
    - [ ] Correct format selected
    - [ ] Multiple formats provided
    - [ ] No larger than necessary

  dimensions:
    - [ ] Sized appropriately for display
    - [ ] Responsive sizes generated
    - [ ] No oversized images
    - [ ] Retina versions where needed

  delivery:
    - [ ] Lazy loading implemented
    - [ ] Proper caching headers
    - [ ] CDN delivery configured
    - [ ] HTTP/2 for multiplexing

  markup:
    - [ ] Width and height attributes
    - [ ] Alt text provided
    - [ ] Srcset implemented
    - [ ] Sizes attribute correct
```

### Performance Metrics
```yaml
performance_targets:
  file_sizes:
    hero_image: "<200KB"
    content_image: "<100KB"
    thumbnail: "<30KB"
    icon: "<5KB"

  loading:
    lcp_target: "<2.5 seconds"
    cls_target: "<0.1"
    fid_target: "<100ms"

  total_page:
    image_budget: "<1MB total"
    requests: "Minimize (HTTP/2 helps)"
```

### CDN Integration
```yaml
cdn_optimization:
  image_cdns:
    cloudinary:
      features:
        - On-the-fly transformations
        - Format auto-detection
        - Quality optimization
        - Global delivery

    imgix:
      features:
        - URL-based transformations
        - Responsive delivery
        - Face detection
        - CDN included

    cloudflare_images:
      features:
        - Simple pricing
        - Variants
        - Direct upload
        - Good performance

  transformation_urls:
    cloudinary: "https://res.cloudinary.com/{cloud}/image/upload/w_800,q_auto,f_auto/{image}"
    imgix: "https://{subdomain}.imgix.net/{image}?w=800&auto=format,compress"
```

## Integration Points

### Related Skills
- `web-production` - Web implementation
- `accessibility-design` - Alt text, decorative images
- `asset-management` - Source file storage
- `brand-compliance` - Image standards

### Build Tool Integration
```yaml
build_integration:
  webpack:
    loader: "image-webpack-loader"
    config: "responsive-loader for srcset"

  vite:
    plugin: "vite-plugin-image-optimizer"

  next_js:
    component: "next/image"
    features: "Built-in optimization"

  gatsby:
    plugin: "gatsby-plugin-image"
    features: "Automatic optimization"
```

## Success Metrics

### Image Optimization KPIs
```yaml
metrics:
  performance:
    - Page load time improvement
    - Image load time
    - Core Web Vitals scores

  efficiency:
    - Bandwidth savings
    - Storage savings
    - Cache hit rate

  quality:
    - Visual quality score
    - Stakeholder approval
    - User feedback
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Web Team | Initial skill creation |

---

*Use this skill to optimize images for maximum performance while maintaining visual quality across all devices and platforms.*
