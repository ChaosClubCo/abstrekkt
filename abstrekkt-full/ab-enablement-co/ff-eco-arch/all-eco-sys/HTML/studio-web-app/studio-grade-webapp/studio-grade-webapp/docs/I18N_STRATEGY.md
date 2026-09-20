# Internationalization (i18n) Strategy

## Supported Locales

1. **en** - English (default)
2. **es** - Spanish
3. **fr** - French
4. **de** - German
5. **ja** - Japanese

## URL Structure

### Format
`/{locale}/{path}`

### Examples
- English: `/about`, `/blog/post`
- Spanish: `/es/about`, `/es/blog/post`
- French: `/fr/about`, `/fr/blog/post`

### Default Locale
- No `/en` prefix for English
- Redirect `/en/*` to `/*`

## Implementation (next-intl)

### Middleware
```tsx
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es', 'fr', 'de', 'ja'],
  defaultLocale: 'en',
  localeDetection: true
});
```

### Message Files
```
messages/
  en.json
  es.json
  fr.json
  de.json
  ja.json
```

### Usage
```tsx
import { useTranslations } from 'next-intl';

function HomePage() {
  const t = useTranslations('HomePage');
  
  return (
    <h1>{t('title')}</h1>
    <p>{t('description')}</p>
  );
}
```

## Hreflang Tags

```tsx
// app/[locale]/layout.tsx
export function generateMetadata({ params }) {
  return {
    alternates: {
      languages: {
        en: '/about',
        es: '/es/about',
        fr: '/fr/about',
        de: '/de/about',
        ja: '/ja/about'
      }
    }
  };
}
```

## RTL Support (Future)

```css
[dir="rtl"] {
  .container {
    /* Use logical properties */
    margin-inline-start: auto;
    margin-inline-end: auto;
    padding-inline: 1rem;
  }
}
```

## Translation Workflow

1. **Extract:** Export strings from codebase
2. **Translate:** Use Lokalise/Phrase for translations
3. **Import:** Update message files
4. **Review:** Native speaker review
5. **Deploy:** Publish updated messages

## Formatting

### Dates
```tsx
import { useFormatter } from 'next-intl';

const format = useFormatter();
format.dateTime(new Date(), {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
// en: November 18, 2025
// es: 18 de noviembre de 2025
```

### Numbers
```tsx
format.number(1234.56, {
  style: 'currency',
  currency: 'USD'
});
// en: $1,234.56
// de: 1.234,56 $
```

---

**Tools:** next-intl, Lokalise (translation management)
