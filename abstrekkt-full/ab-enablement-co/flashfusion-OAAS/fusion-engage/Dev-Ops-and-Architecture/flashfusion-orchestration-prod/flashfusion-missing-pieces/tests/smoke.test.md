# Smoke Test Checklist
- [ ] `GET /health` returns `{ ok: true }`
- [ ] `POST /api/generate/lesson` returns objectives[]
- [ ] Stripe webhook endpoint responds 200 in test mode
- [ ] PostHog event visible after creating lesson
