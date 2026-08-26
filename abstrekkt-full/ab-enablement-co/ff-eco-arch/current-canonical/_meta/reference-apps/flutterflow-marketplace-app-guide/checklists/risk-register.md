# Risk Register — FlutterFlow Marketplace

> The source guide is optimistic and mostly happy-path. A marketplace handles
> strangers' money, messages, and PII, so it carries real risk. This register
> maps each risk to a concrete mitigation already present in this package.

| # | Risk | Severity | Where it bites | Mitigation (in this package) |
|---|------|----------|----------------|------------------------------|
| 1 | **Firestore left in test mode** (`if true`) | Critical | Entire DB public read/write | `firebase/firestore.rules` (default-deny, deploy before launch); launch-checklist BLOCKER |
| 2 | **Client sets `order.status = paid`** | Critical | Free goods / revenue loss | Rules reject; only `stripeWebhook` (Admin SDK) sets it |
| 3 | **Tampered payment amount** | Critical | Underpayment | `createPaymentIntent` uses server-side order price, ignores client amount |
| 4 | **Secret keys in client/repo** (Stripe secret, OpenAI, webhook secret) | Critical | Account drain, key abuse | `firebase-config.example.md`: secrets in Secret Manager only; `.gitignore` provided |
| 5 | **PII over-exposure** (email, FCM tokens, stripe id in public user reads) | High | Privacy breach, spam | `users` doc owner-only read; `publicProfiles` projection for public data |
| 6 | **Open Storage bucket** | High | Cost abuse, malware hosting | `storage.rules`: per-user write scope, image-only, 5MB cap |
| 7 | **No content moderation / trust & safety** | High | Scams, illegal listings, harassment | `reports` collection + admin triage + optional AI moderation gate |
| 8 | **Duplicate/fraudulent reviews** | Medium | Reputation gaming | Deterministic review id `{orderId}_{uid}`; rule-enforced |
| 9 | **Missing composite indexes** | Medium | Broken search/filter in prod | Indexes listed in data model; capture from console into `firestore.indexes.json` |
| 10 | **No observability** | Medium | Silent failures, undetected fraud | Crashlytics + Analytics + webhook/payment alerts (launch-checklist) |
| 11 | **Money stored as float** | Medium | Payout rounding drift | Integer cents everywhere (`dollarsToCents`, data model) |
| 12 | **No rate limiting on AI/payment calls** | Medium | Cost blowout, card testing | Throttle `createPaymentIntent`; per-user AI quota (functions outline) |
| 13 | **No tests for negative paths** | Medium | Exploits ship unnoticed | `testing-checklist.md` security/negative cases |
| 14 | **Unclear admin ownership** | Low/Med | No one triages reports | Admin custom claim + named moderator in launch-checklist |
| 15 | **Vendor/marketing claims taken as fact** | Low | Bad planning/expectations | README CLAIMS CHECK separates verified vs vendor claims; honest 8-week timeline |
| 16 | **Schema drift (rules vs data model vs FlutterFlow types)** | Medium | Silent denials / read failures | Single canonical `firestore-data-model.md`; "change here = change there" notes |

## Ownership

Assign before launch: who owns (a) security rules, (b) the Stripe/webhook
integration, (c) trust & safety triage, (d) the Firebase/OpenAI budget. The
source guide never names an owner for any of these; on a real marketplace, an
unowned payment webhook is an outage waiting to happen.
