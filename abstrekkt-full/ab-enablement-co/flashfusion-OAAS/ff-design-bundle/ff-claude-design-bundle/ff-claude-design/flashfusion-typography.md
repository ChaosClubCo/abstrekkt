# FlashFusion Typography Specimen

## Fonts in use

### 1. Poppins — Display & Headlines
**Source:** Google Fonts (https://fonts.google.com/specimen/Poppins)
**License:** Open Font License
**Weights used:** 600, 700, 800, 900

**Specimens:**
- **Poppins 900** — "Transform Your Vision Into Reality"
- **Poppins 800** — "Build production-ready AI products"
- **Poppins 700** — "Architecture. Code. Deploy."
- **Poppins 600** — "Start Building" · "Get Started" · "Learn More"

### 2. Inter — Body & UI
**Source:** Google Fonts (https://fonts.google.com/specimen/Inter)
**License:** Open Font License
**Weights used:** 400, 500, 600, 700

**Specimens:**
- **Inter 400 body** — "FlashFusion is an AI-powered development platform that transforms ideas into production-ready products through an integrated architecture that spans from specification to deployment."
- **Inter 500 UI** — "Dashboard" · "Projects" · "Settings" · "Deploy"
- **Inter 600 emphasis** — "Important: This action cannot be undone."
- **Inter 700 strong** — "24.8K active users"

### 3. JetBrains Mono — Code & Technical
**Source:** Google Fonts (https://fonts.google.com/specimen/JetBrains+Mono)
**License:** Open Font License
**Weights used:** 400, 600

**Specimens:**
- **JetBrains Mono 400** — `const config = { apiKey: process.env.API_KEY };`
- **JetBrains Mono 600** — `POST /api/v1/projects`

---

## Pairing rationale

- **Poppins + Inter** is a geometric display / neo-grotesque body pairing. Poppins provides personality and weight at display sizes; Inter provides clarity and neutral density at body sizes.
- Avoid using Poppins for body (hinting is not optimized for <14px) and avoid using Inter for hero display (lacks the geometric presence needed for impact).
- Never substitute with Space Grotesk, Roboto, or Montserrat — these are explicitly *not* the FlashFusion typeface.

---

## Weight usage map

| Role | Font | Weight | Size | Example |
|---|---|---|---|---|
| Hero headline | Poppins | 900 | 72px | "Transform Your Vision" |
| Page title | Poppins | 800 | 48px | "Your Dashboard" |
| Section heading | Poppins | 700 | 36px | "Recent Projects" |
| Card title | Poppins | 700 | 24px | "API Gateway" |
| Subheading | Poppins | 600 | 20px | "Configuration" |
| Button label | Poppins | 600 | 15px | "Deploy" |
| Body text | Inter | 400 | 16px | "Your project has been deployed successfully." |
| Small body | Inter | 400 | 14px | "Last updated 2 minutes ago" |
| UI label | Inter | 500 | 14px | "Project Name" |
| Nav item | Inter | 500 | 14px | "Dashboard" |
| Caption | Inter | 400 | 12px | "Uptime: 99.98%" |
| Code inline | JetBrains Mono | 400 | 14px | `api.deploy()` |
| Code block | JetBrains Mono | 400 | 14px | multi-line code blocks |
| Code emphasis | JetBrains Mono | 600 | 14px | highlighted tokens |

---

## Google Fonts import (canonical)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

## CSS variables

```css
:root {
  --ff-font-display: 'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --ff-font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --ff-font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
}
```

---

*This specimen is the typography source of truth for the FlashFusion design system.*
