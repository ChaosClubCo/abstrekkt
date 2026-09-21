# Environment Variables — Invoke / audit.flashfusion.co

Add these in B44 app settings → Environment Variables.
NEVER commit to git. NEVER in client-side code.

---

## REQUIRED (app breaks without these)

| Variable | Where to get it | Status |
|---|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys | ☐ |
| `OPENAI_API_KEY` | platform.openai.com → API Keys | ☐ |
| `GEMINI_API_KEY` | aistudio.google.com → Get API Key | ☐ |

## REQUIRED FOR NOTIFICATIONS

| Variable | Where to get it | Status |
|---|---|---|
| `N8N_WEBHOOK_URL` | Use: https://krosebrook.app.n8n.cloud/webhook/flashfusion-synthesis | ☐ |

## OPTIONAL (used for Calendly webhook verification)

| Variable | Where to get it | Status |
|---|---|---|
| `CALENDLY_WEBHOOK_SECRET` | Calendly → Integrations → Webhooks | ☐ |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API Keys | ☐ |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → Signing secret | ☐ |

---

## Verification

After adding all keys, run:
```bash
node code/smoke-test.js
```

All 7 tests should pass. If any API call fails, check the key is correct
and hasn't been rotated.
