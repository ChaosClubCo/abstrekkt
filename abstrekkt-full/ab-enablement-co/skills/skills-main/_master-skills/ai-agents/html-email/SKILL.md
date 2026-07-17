---
name: html-email
description: Master HTML email development with responsive templates, cross-client compatibility, testing workflows, and deliverability optimization. Use when configuring, building, or troubleshooting AI agent workflows.
---

# HTML Email Skill

## Instructions


> Master HTML email development with responsive templates, cross-client compatibility, testing workflows, and deliverability optimization.

## Skill Overview

This skill provides expertise in creating effective HTML email campaigns, from template development to testing and deployment. It covers coding best practices, responsive design, and email client compatibility.

## Core Capabilities

### Email Templates
- Responsive email design
- Modular template systems
- Dynamic content blocks
- Personalization tokens
- Dark mode support
- Accessibility compliance

### Cross-Client Compatibility
- Client-specific rendering
- Fallback strategies
- Progressive enhancement
- Outlook compatibility
- Mobile optimization
- Web client support

### Testing & Delivery
- Preview testing
- Deliverability checks
- Performance optimization
- A/B testing
- Analytics integration
- QA workflows

## Email Development Framework

### HTML Email Structure
```html
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Email Subject Line</title>

  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->

  <style>
    /* CSS Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

    /* Responsive Styles */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .stack { display: block !important; width: 100% !important; }
      .hide-mobile { display: none !important; }
      .show-mobile { display: block !important; }
    }

    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      .darkmode-bg { background-color: #1a1a1a !important; }
      .darkmode-text { color: #ffffff !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #f4f4f4;">

  <!-- Preview Text -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    Preview text appears here &#847; &#847; &#847;
  </div>

  <!-- Email Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 10px;">

        <!-- Content Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container">

          <!-- Header -->
          <tr>
            <td style="padding: 20px; background-color: #ffffff;">
              <img src="logo.png" alt="Company Name" width="150" style="display: block;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 20px; background-color: #ffffff;">
              <!-- Content goes here -->
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background-color: #f8f8f8; text-align: center; font-size: 12px; color: #666666;">
              <p>Company Name | Address | City, State ZIP</p>
              <p><a href="{{unsubscribe_link}}">Unsubscribe</a> | <a href="{{preferences_link}}">Email Preferences</a></p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
```

### Responsive Design Patterns
```yaml
responsive_strategies:
  fluid_layout:
    approach: "Percentage-based widths"
    max_width: "600px"
    container: "width: 100%; max-width: 600px;"

  stacking_columns:
    desktop: "Side-by-side columns"
    mobile: "Stacked vertically"
    breakpoint: "600px or 480px"
    code: |
      <table class="stack" style="display: inline-block; width: 280px;">

  responsive_images:
    approach: "Fluid images with max-width"
    code: |
      <img style="max-width: 100%; height: auto; display: block;">

  scalable_text:
    approach: "Larger text on mobile"
    desktop: "16px body, 24px headlines"
    mobile: "18px body, 28px headlines"

  touch_targets:
    minimum: "44x44px"
    buttons: "Larger padding on mobile"
    links: "Adequate spacing"
```

### Module Library
```yaml
email_modules:
  header:
    types:
      - Logo only
      - Logo + navigation
      - Logo + menu icon
      - Full navigation bar

  hero:
    types:
      - Image hero
      - Text hero
      - Split hero (image + text)
      - Video thumbnail

  content_blocks:
    types:
      - Single column text
      - Two column (50/50)
      - Two column (70/30)
      - Three column
      - Card grid

  cta:
    types:
      - Button (primary)
      - Button (secondary)
      - Text link
      - Icon + text

  product:
    types:
      - Single product card
      - Product grid (2-up)
      - Product grid (3-up)
      - Product list

  social:
    types:
      - Icon row
      - Icon with labels
      - Share buttons
      - Follow CTA

  footer:
    types:
      - Simple (unsubscribe only)
      - Standard (links + social)
      - Full (navigation + contact)
```

## Client Compatibility

### Email Client Support Matrix
```yaml
client_support:
  outlook:
    versions: "2007, 2010, 2013, 2016, 2019, 365"
    rendering_engine: "Microsoft Word"
    issues:
      - No background images (without VML)
      - Limited CSS support
      - No CSS3
      - Padding issues on images
    solutions:
      - Use VML for backgrounds
      - Inline all CSS
      - Use tables for layout
      - Add display:block to images

  apple_mail:
    versions: "macOS, iOS"
    rendering_engine: "WebKit"
    issues:
      - Generally good support
      - Dark mode adjustments
    solutions:
      - Test dark mode
      - Use color-scheme meta

  gmail:
    versions: "Web, Android, iOS"
    rendering_engine: "Varies"
    issues:
      - Strips head styles (sometimes)
      - Embedded styles preferred
      - No media query (Gmail app)
    solutions:
      - Inline CSS
      - Use hybrid/fluid design
      - Test thoroughly

  yahoo:
    versions: "Web, Mobile"
    issues:
      - Inconsistent rendering
      - Some CSS stripped
    solutions:
      - Inline CSS
      - Simple layouts
```

### Outlook VML Backgrounds
```html
<!--[if gte mso 9]>
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:400px;">
  <v:fill type="tile" src="background.jpg" color="#f4f4f4"/>
  <v:textbox inset="0,0,0,0">
<![endif]-->

<div style="background-image: url('background.jpg'); background-color: #f4f4f4; padding: 40px;">
  <!-- Content -->
</div>

<!--[if gte mso 9]>
  </v:textbox>
</v:rect>
<![endif]-->
```

### Dark Mode Support
```css
/* Meta tag for system preference */
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">

/* CSS for dark mode */
@media (prefers-color-scheme: dark) {
  .darkmode-bg { background-color: #1a1a1a !important; }
  .darkmode-text { color: #ffffff !important; }
  .darkmode-text-secondary { color: #cccccc !important; }
}

/* For Yahoo/AOL */
[data-ogsc] .darkmode-bg { background-color: #1a1a1a !important; }
[data-ogsc] .darkmode-text { color: #ffffff !important; }
```

## Testing Workflow

### Testing Checklist
```yaml
email_testing_checklist:
  pre_send:
    content:
      - [ ] All copy proofread
      - [ ] Personalization tokens tested
      - [ ] Dynamic content verified
      - [ ] Links tested (all work)
      - [ ] Tracking parameters added
      - [ ] Unsubscribe link works

    design:
      - [ ] Images display correctly
      - [ ] Alt text on all images
      - [ ] Layout renders properly
      - [ ] Mobile view tested
      - [ ] Dark mode tested
      - [ ] Brand guidelines followed

    technical:
      - [ ] HTML validated
      - [ ] File size optimized (<100KB)
      - [ ] Image sizes optimized
      - [ ] Subject line tested
      - [ ] Preview text displays
      - [ ] Sender name correct

    deliverability:
      - [ ] Spam score checked
      - [ ] Authentication verified (SPF, DKIM, DMARC)
      - [ ] Blacklist check
      - [ ] Inbox placement tested

  client_testing:
    priority_clients:
      - [ ] Apple Mail (iOS)
      - [ ] Gmail (Web)
      - [ ] Gmail (Android)
      - [ ] Outlook 365
      - [ ] Outlook 2019
      - [ ] Yahoo Mail

    secondary_clients:
      - [ ] Apple Mail (macOS)
      - [ ] Outlook 2016
      - [ ] Outlook.com
      - [ ] Samsung Mail
```

### Testing Tools
```yaml
testing_tools:
  rendering_testing:
    litmus:
      features:
        - 90+ email client previews
        - Spam testing
        - Link checking
        - Analytics
      cost: "Premium"

    email_on_acid:
      features:
        - Client previews
        - Accessibility testing
        - Campaign precheck
      cost: "Premium"

  code_validation:
    html_email_check:
      features:
        - HTML validation
        - CSS support checking
        - Free tier available

    parcel:
      features:
        - Code editor
        - Real-time preview
        - Collaboration

  deliverability:
    mail_tester:
      features:
        - Spam score
        - Authentication check
        - Free basic testing

    glock_apps:
      features:
        - Inbox placement
        - Blacklist monitoring
        - Detailed reports
```

## Email Performance

### Optimization Best Practices
```yaml
optimization:
  file_size:
    target: "<100KB total"
    strategies:
      - Minify HTML
      - Compress images
      - Use web-safe fonts
      - Limit custom fonts

  images:
    format: "JPG for photos, PNG for graphics, GIF for simple animation"
    compression: "60-80% quality for JPG"
    dimensions: "2x for retina, CSS sized"
    fallback: "Always include alt text"

  load_time:
    image_hosting: "Use CDN for images"
    lazy_loading: "Not supported, load all"
    optimization: "Prioritize above-fold content"

  accessibility:
    semantic: "Use role='presentation' on layout tables"
    alt_text: "Descriptive alt for all images"
    contrast: "4.5:1 minimum ratio"
    font_size: "16px minimum body text"
    links: "Descriptive link text"
```

### Performance Metrics
```yaml
email_metrics:
  engagement:
    open_rate:
      benchmark: "15-25%"
      factors:
        - Subject line
        - Sender name
        - Send time
        - List quality

    click_rate:
      benchmark: "2-5%"
      factors:
        - Content relevance
        - CTA clarity
        - Design quality
        - Personalization

    click_to_open:
      benchmark: "10-15%"
      factors:
        - Content quality
        - Email design
        - CTA effectiveness

  deliverability:
    inbox_placement: ">95%"
    bounce_rate: "<2%"
    spam_complaint: "<0.1%"
    unsubscribe: "<0.5%"
```

## Template Systems

### Email Design System
```yaml
design_tokens:
  colors:
    primary: "#0066CC"
    secondary: "#333333"
    accent: "#FF6600"
    background: "#FFFFFF"
    surface: "#F4F4F4"
    text: "#333333"
    text_secondary: "#666666"
    link: "#0066CC"

  typography:
    font_family: "Arial, Helvetica, sans-serif"
    font_size_body: "16px"
    font_size_small: "14px"
    font_size_h1: "28px"
    font_size_h2: "24px"
    font_size_h3: "20px"
    line_height: "1.5"

  spacing:
    xs: "8px"
    sm: "16px"
    md: "24px"
    lg: "32px"
    xl: "48px"

  buttons:
    padding: "12px 24px"
    border_radius: "4px"
    font_size: "16px"
    font_weight: "bold"
```

## Integration Points

### Related Skills
- `template-systems` - Template management
- `brand-compliance` - Brand standards
- `creative-testing` - A/B testing
- `accessibility-design` - WCAG compliance

### Platform Integrations
```yaml
integrations:
  esp_platforms:
    - Mailchimp
    - Klaviyo
    - HubSpot
    - Salesforce Marketing Cloud
    - Braze

  design_tools:
    - Figma (design)
    - Parcel (coding)
    - Stripo (builder)

  testing:
    - Litmus
    - Email on Acid
```

## Success Metrics

### Email Development KPIs
```yaml
metrics:
  quality:
    - Render issues reported
    - Accessibility compliance
    - Brand compliance

  efficiency:
    - Development time
    - Revision cycles
    - Template reuse rate

  performance:
    - Email engagement rates
    - Deliverability scores
    - Conversion rates
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Email Team | Initial skill creation |

---

*Use this skill to create effective, accessible HTML emails that render consistently across email clients and drive engagement.*
