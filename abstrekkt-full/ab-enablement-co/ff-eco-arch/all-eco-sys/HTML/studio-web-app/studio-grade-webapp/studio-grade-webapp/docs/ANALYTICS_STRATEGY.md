# Analytics & Feedback Strategy

## KPI Framework

### Primary Metrics
- **Conversion Rate:** Form submissions / Visitors
- **Bounce Rate:** <40% target
- **Session Duration:** >2 minutes average
- **Core Web Vitals:** LCP <2.5s, CLS <0.1

### Secondary Metrics
- Page views per session
- Scroll depth (25%, 50%, 75%, 100%)
- Time to conversion
- Exit pages

## Event Taxonomy

### User Engagement
```javascript
// Hero CTA click
gtag('event', 'cta_primary_click', {
  event_category: 'engagement',
  event_label: 'hero_cta',
  value: 1
});

// Service card viewed
gtag('event', 'service_card_view', {
  event_category: 'engagement',
  event_label: service_name,
  value: 1
});
```

### Form Interactions
```javascript
// Form start
gtag('event', 'form_start', {
  event_category: 'forms',
  event_label: 'contact_form'
});

// Form submission
gtag('event', 'form_submit_success', {
  event_category: 'conversion',
  event_label: 'contact_form',
  value: 1
});
```

## Privacy-First Analytics

### Plausible Setup (Recommended)
```jsx
<Script
  defer
  data-domain="flashfusion.com"
  src="https://plausible.io/js/script.js"
/>
```

### GA4 with Anonymization
```jsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', {
      anonymize_ip: true,
      allow_google_signals: false
    });
  `}
</Script>
```

## User Feedback Loops

### In-App Feedback Widget
```tsx
<FeedbackWidget>
  <Question>Was this page helpful?</Question>
  <Button value="yes">Yes</Button>
  <Button value="no">No</Button>
  
  {showFollowup && (
    <Textarea placeholder="Tell us more..." />
  )}
</FeedbackWidget>
```

### Contact Form Analytics
```javascript
// Track field completion
fields.forEach(field => {
  field.addEventListener('blur', () => {
    gtag('event', 'form_field_completed', {
      event_label: field.name
    });
  });
});
```

## Dashboard Setup

### Google Analytics 4
1. Create property
2. Enable enhanced measurement
3. Set up conversions:
   - Contact form submission
   - Service inquiry
   - Blog signup

### Custom Reports
- Traffic sources by page
- Conversion funnels
- Content performance
- User flow

---

**Tools:** Plausible / GA4, Hotjar (optional), Sentry
