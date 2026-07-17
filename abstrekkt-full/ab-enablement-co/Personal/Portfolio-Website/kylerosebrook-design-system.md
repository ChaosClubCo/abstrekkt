# kylerosebrook.com — Design System & Trust Signals

> Generated: 2026-04-08

---

## Brand Color Palette

### CSS Custom Properties

```css
:root {
  /* Primary — Deep navy/indigo for trust and expertise */
  --color-primary: #1a1a2e;
  --color-primary-light: #16213e;
  --color-primary-dark: #0f0f1a;

  /* Accent — Electric blue for innovation and tech */
  --color-accent: #4361ee;
  --color-accent-light: #5a7cf7;
  --color-accent-dark: #3248c9;

  /* Secondary — Warm amber for approachability */
  --color-secondary: #f59e0b;
  --color-secondary-light: #fbbf24;

  /* Neutrals */
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-text-inverse: #f9fafb;
  --color-bg: #ffffff;
  --color-bg-alt: #f3f4f6;
  --color-border: #e5e7eb;

  /* CTA */
  --color-cta: #4361ee;
  --color-cta-hover: #3248c9;
  --color-cta-text: #ffffff;

  /* Status */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

---

## Typography

### Recommended Pairing (Google Fonts, free)

- **Headings:** Inter (700, 600)
- **Body:** Inter (400, 500)
- **Code/mono:** JetBrains Mono

```css
/* Add to WordPress Customizer → Additional CSS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }

code, pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
}
```

---

## Icon Set Recommendation

**Recommended:** [Lucide Icons](https://lucide.dev) (free, MIT licensed, SVG)

| Section | Current Emoji | Suggested Lucide Icon |
|---------|--------------|----------------------|
| AppSec | shield | `shield-check` |
| AI Integration | zap | `cpu` or `brain-circuit` |
| Platform Engineering | building | `layers` or `server` |
| Fractional CTO | rocket | `compass` or `target` |
| Projects | folder | `folder-code` |
| Contact | mail | `mail` |
| Workshop | graduation cap | `code-2` or `terminal` |
| GitHub | — | `github` |
| LinkedIn | — | `linkedin` |

Install: Copy SVGs directly from lucide.dev or use `<img src="https://unpkg.com/lucide-static/icons/ICON_NAME.svg">`

---

## Hero Section Design

### Layout Structure

```
┌──────────────────────────────────────────────┐
│  [Nav: Home | About | Work | Services | ...]  │
├──────────────────────────────────────────────┤
│                                               │
│   SELF-TAUGHT · BUILDER · FOUNDER             │
│                                               │
│   Kyle Rosebrook          ┌──────────┐        │
│   I build AI systems...   │ Headshot │        │
│                           │ (circle) │        │
│   [See My Work]           └──────────┘        │
│   [Get In Touch]                              │
│                                               │
└──────────────────────────────────────────────┘
```

### Headshot Specs
- Dimensions: 400x400px minimum (displayed as circle)
- Style: Professional but approachable — solid background, good lighting
- Format: WebP with JPG fallback
- Placement: Right side of hero on desktop, above text on mobile

---

## Card-Based Layout CSS

```css
/* What I Do / Active Projects cards */
.service-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
}

.service-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.service-card h3 {
  margin-bottom: 0.75rem;
  color: var(--color-primary);
}

.service-card p {
  color: var(--color-text-light);
  font-size: 0.95rem;
}
```

---

## Sticky CTA Button CSS

```css
.sticky-cta {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--color-cta);
  color: var(--color-cta-text);
  padding: 0.875rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
  transition: background 0.2s, transform 0.2s;
  z-index: 1000;
}

.sticky-cta:hover {
  background: var(--color-cta-hover);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .sticky-cta {
    bottom: 1rem;
    right: 1rem;
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }
}
```

---

## Professional Email Setup

### Current Status
You already have: **krosebrook@kylerosebrook.com** (Active, WordPress.com Titan email, renews June 21, 2026)

### To Add kyle@kylerosebrook.com
1. Go to https://wordpress.com/email/kylerosebrook.com
2. Click "Add new mailboxes"
3. Create `kyle@kylerosebrook.com`
4. Cost: ~$3.50/month additional

### Update Site References
Replace `kylerosebrook@gmail.com` with `krosebrook@kylerosebrook.com` (or `kyle@`) in:
- Contact page form
- Footer
- Any mailto: links
- Google Search Console
- Google Analytics

---

## Testimonial Request Email Templates

### Template 1: Former Colleague

**Subject:** Quick favor — would you write a short testimonial?

Hi [Name],

Hope you're doing well. I'm building out my consulting site (kylerosebrook.com) and I'd love a short testimonial from someone who's worked alongside me.

Would you be willing to write 2-3 sentences about our experience working together? Specifically, what was it like collaborating on [project/area], and what stood out about how I approach technical problems?

No pressure at all — even a few words would mean a lot. Happy to return the favor anytime.

Thanks,
Kyle

### Template 2: Consulting Client/Collaborator

**Subject:** Would you share a quick review of our work together?

Hi [Name],

I really enjoyed working with you on [project]. As I'm growing my consulting practice, testimonials from people I've actually worked with carry enormous weight.

Would you be open to writing 2-3 sentences about:
- What challenge you were facing when we started
- What the experience of working together was like
- What results or outcomes you saw

I can draft something for you to edit if that's easier. Just let me know.

Thanks so much,
Kyle

### Template 3: Workshop Attendee

**Subject:** How was the workshop? I'd love your feedback

Hi [Name],

Thanks for attending the Vibe Coding Workshop! I hope it was valuable.

If it was, I have a quick ask — would you write a short testimonial (2-3 sentences) about what you learned or how it changed your workflow? I'd feature it on the workshop page to help future attendees know what to expect.

A few questions to guide you:
- What was your skill level before the workshop?
- What was the most useful thing you learned?
- Would you recommend it to other developers?

Thanks,
Kyle

---

## Credentials Section Copy

### For About Page or Homepage

```
## Experience & Credentials

- [X]+ years in software engineering
- Staff-level engineer specializing in AppSec and AI infrastructure
- [X] production AI systems designed and deployed
- [X] application security reviews completed
- [X] repositories consolidated via MONOTURBO methodology
- [X] AI Setup Score assessments delivered

### Technologies
React, Next.js, Node.js, Python, TypeScript, Cloudflare Workers, Supabase, 
PostgreSQL, Docker, Terraform, GitHub Actions, Claude, GPT-4, Cursor

### Certifications
[Add any relevant certs: AWS, CompTIA Security+, etc.]
```

*Replace all [X] placeholders with actual numbers before publishing.*
