# FlashFusion brand fonts

**Status:** ✅ self-hosted and active. All brand binaries are committed here and `colors_and_type.css` imports `fonts-selfhosted.css` directly — no runtime CDN dependency.

## Files

| Family | Role | Weights | Files |
|---|---|---|---|
| Space Grotesk | Display | 300–700 (variable) + static fallbacks | `space-grotesk-variable.ttf`, `space-grotesk-300.ttf` … `space-grotesk-700.ttf` |
| Inter | Body / UI | 400, 500, 600, 700 | `inter-400.woff2` … `inter-700.woff2` |
| Instrument Serif | Editorial | 400 regular + 400 italic | `instrument-serif-400.woff2`, `instrument-serif-400-italic.woff2` |
| JetBrains Mono | Code | 400, 500, 600 | `jetbrains-mono-400.woff2` … `jetbrains-mono-600.woff2` |

Space Grotesk replaces the previous Poppins display face (uploaded directly by the brand owner). The `.ttf` variable file covers the full 300–700 range in one binary; the five static-weight `.ttf`s remain as a progressive-enhancement fallback for environments without variable-font axis support.

Inter / Instrument Serif / JetBrains Mono are the Latin subset as packaged by [Fontsource](https://github.com/fontsource/font-files), renamed on import.

## Licenses

- Space Grotesk → [SIL Open Font License 1.1](https://openfontlicense.org/)
- Inter, Instrument Serif, JetBrains Mono → [SIL Open Font License 1.1](https://openfontlicense.org/)

OFL permits embedding and redistribution; keep license notices intact in any production deploy.

## Reverting display face to a CDN

If you need to fall back to Google Fonts for the display face (e.g. removing the binaries to slim the repo for a sandbox demo), keep the Inter/Instrument Serif/JetBrains Mono `@font-face` blocks in `fonts-selfhosted.css` and add to the top of `colors_and_type.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```

…then comment out the Space Grotesk `@font-face` declarations in `fonts-selfhosted.css`.
