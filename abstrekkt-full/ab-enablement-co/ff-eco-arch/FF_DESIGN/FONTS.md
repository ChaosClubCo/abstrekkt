# FlashFusion Font Manifest v3.1

## Active Fonts

### 1. Geist — Primary UI Font
**Foundry:** Vercel (MIT)  
**Source:** https://vercel.com/font  
**CDN:** https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700  
**Weights:** 300, 400, 500, 600, 700  
**Usage:** All body text, UI labels, buttons, navigation, data tables, form elements  
**Variable font:** Yes — `wght` axis 100–900  

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```css
font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
```

---

### 2. Geist Mono — Code / Data Font
**Foundry:** Vercel (MIT)  
**Source:** https://vercel.com/font  
**CDN:** https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500  
**Weights:** 300, 400, 500  
**Usage:** Code blocks, terminal output, API keys, data values, mono labels  

```css
font-family: 'Geist Mono', 'SFMono-Regular', Menlo, monospace;
```

---

### 3. Instrument Serif — Display / Editorial
**Foundry:** Google Fonts (OFL)  
**Source:** https://fonts.google.com/specimen/Instrument+Serif  
**CDN:** https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1  
**Weights:** 400 (regular + italic)  
**Usage:** Hero headlines only, pull quotes, editorial moments. Never body text. Never UI chrome.  

```css
font-family: 'Instrument Serif', 'Times New Roman', serif;
```

---

### 4. Poppins — Logo Wordmark Only
**Foundry:** Google Fonts (OFL)  
**Source:** https://fonts.google.com/specimen/Poppins  
**Weight:** 700 Bold only  
**Usage:** FLASHFUSION wordmark only. Do NOT use anywhere else in the system.  
**Load strategy:** Only load on pages that render the logo as text. Prefer SVG-embedded path for logo.

```css
/* Logo only — never apply to UI elements */
font-family: 'Poppins', sans-serif;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.05em;
```

---

## Deprecated (do not use)

| Font | Status | Replace with |
|---|---|---|
| Instrument Sans | DEPRECATED May 2026 | Geist |
| JetBrains Mono | DEPRECATED May 2026 | Geist Mono |

---

## Full Load Block (all active fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&family=Poppins:wght@700&display=swap" rel="stylesheet">
```

## Next.js / Tailwind Config

```js
// next.config.js
import { Geist, Geist_Mono, Instrument_Serif, Poppins } from 'next/font/google'

export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-logo',
  display: 'swap',
})
```

```js
// tailwind.config.js
theme: {
  extend: {
    fontFamily: {
      body:    ['var(--font-body)'],
      mono:    ['var(--font-mono)'],
      display: ['var(--font-display)'],
      logo:    ['var(--font-logo)'],
    }
  }
}
```

---

## Performance Notes
- Geist and Geist Mono are variable fonts — single file covers all weights
- Use `display=swap` on all fonts — prevents FOIT
- Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com` on every page
- For self-hosting: download from Vercel's repo (MIT licensed) and serve via Vercel Edge
