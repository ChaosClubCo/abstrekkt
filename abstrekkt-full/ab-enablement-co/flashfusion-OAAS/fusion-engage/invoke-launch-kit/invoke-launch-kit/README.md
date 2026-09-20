# Invoke Launch Kit
## audit.flashfusion.co — Build Session May 2026

### What This Kit Contains

| Folder | Contents |
|---|---|
| `prompts/` | Scorecard AI prompt, audit report prompt, executive report prompts |
| `prompts/claude-design/` | 8 page design prompts → paste into Claude Design, export to B44 |
| `code/` | AI_MODELS constant, unified callAI function, smoke test |
| `scripts/` | Auto-availability seeder, model string updater, API key tester |
| `n8n/` | Lead notification workflow JSON template |
| `data/` | Test persona, env vars checklist |
| `docs/` | Full gap audit, implementation log |

---

### System Architecture (what was built)

```
Landing Page
    ↓
[FREE SCORECARD — no auth required]
Ecosystem Q (q0) → 10 scored Qs → email capture
    ↓
Claude/OpenAI/Gemini API call (provider matched to ecosystem_primary)
    ↓
Inline results render (score + maturity + 3 recs + ecosystem badges)
+ 30s delay → result email to lead + admin notification to n8n webhook
    ↓
Dual CTAs: [Download PDF] [Book Full Audit · $1,500 → Calendly]
    ↓
[FULL AUDIT — $1,500 via Calendly+Stripe]
25Q deep-dive → section scores (tools/literacy/data/process/roi)
90-day roadmap + strategy session
    ↓
[RETAINER — $4,500]
Client portal → Onboarding wizard (auto-launched on Engagement create)
Roadmap/milestones → evidence files + threaded comments
Executive reports → role-based (exec/lead/contributor) via n8n
```

---

### 3 Things Still Required From You

1. **Calendly event** — Create "AI Strategy Audit" event, attach $1,500 Stripe price, replace URL placeholder in B44 editor
2. **n8n workflow** — Import `n8n/lead-notification-workflow.json`, map webhook events
3. **2 resource PDFs** — Create, host, update `file_url` in B44, flip `is_public: true`

---

### Security Applied

- Role guard: non-admin users redirected from `/admin` routes
- RLS on 7 entities: FreeAssessment, AuditSubmission, Engagement, Roadmap, ClientMessage, Document, Notification
- All API keys via env vars (ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY)
- Broken resource PDFs set to `is_public: false`

---

### Model Strings (current)

```
claude-sonnet-4-6        → primary inference
claude-haiku-4-5-20251001 → fast/classification
gpt-4o                   → OpenAI primary
gpt-4o-mini              → OpenAI fast
gemini-2.0-flash         → Gemini primary
gemini-1.5-flash         → Gemini fast
```

Next deprecation check: run `scripts/model-string-updater.sh` before any Anthropic model sunset.
