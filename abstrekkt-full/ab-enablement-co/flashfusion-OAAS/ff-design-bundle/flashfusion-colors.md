# FlashFusion Color System

## Core palette — dark-mode native

| Token | Hex | RGB | Role | Contrast on `#0A0A0F` |
|---|---|---|---|---|
| `--ff-void` | `#0A0A0F` | 10, 10, 15 | Primary background | — |
| `--ff-deep` | `#141328` | 20, 19, 40 | Elevated surface | — |
| `--ff-indigo` | `#322B75` | 50, 43, 117 | Surface / borders | 3.1:1 |
| `--ff-primary` | `#8B5CF6` | 139, 92, 246 | **Brand primary fill** | 4.2:1 AA large |
| `--ff-primary-light` | `#C4B5FD` | 196, 181, 253 | Violet text / links | 10.3:1 AAA |
| `--ff-glow` | `#A855F7` | 168, 85, 247 | Glow highlights | 5.2:1 AA |
| `--ff-electric` | `#06B6D4` | 6, 182, 212 | **Accent / secondary brand** | 6.1:1 AA |
| `--ff-electric-light` | `#67E8F9` | 103, 232, 249 | Electric text / focus rings | 11.2:1 AAA |
| `--ff-bright` | `#E0E7FF` | 224, 231, 255 | Text on colored surfaces | 16.8:1 AAA |
| `--ff-text` | `#F8FAFC` | 248, 250, 252 | Primary body text | 19:1 AAA |
| `--ff-text-muted` | `#94A3B8` | 148, 163, 184 | Secondary text | 7.8:1 AAA |

## Semantic palette

| Token | Hex | Role |
|---|---|---|
| `--ff-success` | `#10B981` | Success states, positive confirmations |
| `--ff-warning` | `#F59E0B` | Warning states, caution |
| `--ff-danger` | `#EF4444` | Error, destructive actions |
| `--ff-info` | `#06B6D4` | Informational (aliases to `--ff-electric`) |

## Gradient treatments

### Hero mesh gradient
```css
background:
  radial-gradient(ellipse at 25% 30%, rgba(50, 43, 117, 0.6) 0%, transparent 55%),
  radial-gradient(ellipse at 82% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
  linear-gradient(180deg, #0A0A0F 0%, #141328 100%);
```

### Card backdrop
```css
background: linear-gradient(135deg, rgba(10, 10, 15, 0.55) 0%, rgba(20, 19, 40, 0.35) 100%);
backdrop-filter: blur(14px) saturate(140%);
```

## Shadows & glow

```css
--ff-glow-purple: 0 0 40px rgba(139, 92, 246, 0.25);
--ff-glow-cyan: 0 0 80px rgba(6, 182, 212, 0.15);
--ff-shadow-card: 0 0 0 1px rgba(10, 10, 15, 0.4) inset,
                  0 24px 60px -20px rgba(0, 0, 0, 0.6);
--ff-border-subtle: 1px solid rgba(196, 181, 253, 0.12);
```

## Usage rules

1. **Backgrounds are always dark** — `--ff-void` (page) or `--ff-deep` (elevated). No light-mode variants exist.
2. **Primary fill is `--ff-primary`** — never `--ff-glow` for solid UI. Glow is reserved for decorative luminance.
3. **Text hierarchy:** `--ff-text` (primary) → `--ff-text-muted` (secondary) → `--ff-primary-light` (violet emphasis) → `--ff-electric-light` (electric emphasis).
4. **Accent restraint** — `--ff-electric` / `--ff-electric-light` used sparingly as secondary signal; never dominant.
5. **No ambient white** — pure `#FFFFFF` is not part of this palette. Use `--ff-text` (`#F8FAFC`) for body or `--ff-bright` (`#E0E7FF`) for high-contrast situations.

## Anti-patterns

- Generic purple-to-pink gradients on white backgrounds
- Violet text under 14px on `--ff-void` (fails contrast — use `--ff-text` instead)
- Using `--ff-primary` as body text color (fails AA at body sizes)
- Using `--ff-glow` as a button fill (reserved for decorative effects)

---

*These color tokens are the source of truth for the FlashFusion design system.*
