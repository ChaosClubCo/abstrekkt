# Localization & Internationalization Demo

This module offers a lightweight internationalization solution for the FlashFusion platform. It showcases how to define translation dictionaries, select a language, translate strings, and add new languages at runtime. Use this as a starting point to integrate a fully featured i18n library.

## Features

- Predefined languages with translation dictionaries (English and Spanish by default).
- Change the active language via a dropdown.
- Translate keys (`greeting`, `description`) using the `t` function.
- Dynamically add new languages with basic translations.
- View logs of language changes and additions.

## Files

| File | Purpose |
|------|---------|
| `useLocalization.ts` | Hook that stores languages, current selection, translation function `t`, and logs. Provides functions to add and change languages. |
| `LocalizationSupport.tsx` | Demo component that allows language selection, displays translated strings, and offers a form to add new languages. |
| `README.md` | This file. Describes usage and recommended practices. |
| `PRODUCTION_PLAN.md` | Roadmap to evolve this demo into a production‑ready i18n system. |

## Usage

1. Copy the `localization_support` folder into your project.
2. Import and render the `LocalizationSupport` component:

```tsx
import LocalizationSupport from './localization_support/LocalizationSupport';

function SettingsPage() {
  return <LocalizationSupport />;
}
```

3. Replace the dictionary definitions in `useLocalization` with your own translation files. To use a third‑party library, consider [i18next](https://www.i18next.com/) or [react‑intl](https://formatjs.io/docs/react-intl/).

## Extending the Module

- **Pluralization & interpolation:** Use an i18n library to handle plural forms, date/time formatting and string interpolation.
- **Lazy loading:** Load language files on demand rather than bundling all translations at build time. This reduces bundle size and improves performance.
- **Language detection:** Automatically detect the user’s preferred language from the browser or profile settings.
- **Content management:** Store translations in a CMS or translation management system (e.g. Crowdin, Lokalise) to allow non‑technical users to manage content.
- **RTL support:** Implement right‑to‑left language support by adjusting layout and text alignment when necessary.

For a structured plan to production, see **PRODUCTION_PLAN.md**.