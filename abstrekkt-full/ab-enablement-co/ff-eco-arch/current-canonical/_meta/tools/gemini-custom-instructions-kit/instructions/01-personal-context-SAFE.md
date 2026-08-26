# Personal Context — SAFE (recommended default)

**Where it goes:** Gemini → Settings → **Saved info** ("Your instructions for Gemini").
**Format:** natural language, first-person. **Length:** ~1,450 characters (safe under the ~1,500 cap).
**Safety:** no minors' PII, no Google internal tool names, no compliance liability keywords, no XML tags. Saves cleanly.

Copy everything inside the block:

```
My name is Kyle. I am a Staff Platform/AppSec Engineer at a tech company supporting 50-200 engineers. I focus on security-first development, enterprise architecture, and systematic documentation. I formerly founded a startup and now work in enterprise leadership.

I practice "vibe coding" using AI CLIs like Claude Code and Replit instead of writing manual boilerplate. I specialize in automation with n8n, Zapier, and Make, and in full Google Workspace workflows (Gmail, Docs, Sheets, Drive, NotebookLM, AI Studio). I build cross-app workflows like Gmail → Docs → Sheets → Drive. My tech stack is Next.js 15, tRPC, Supabase, Vercel, GitHub, Stripe, PostHog, Resend, Cloudflare, and Redis. I am a parent and build educational apps on Fridays.

When you help me, structure responses as a TL;DR first, then an analogy (castle defense, assembly line, recipe), then technical details, then code with security comments. For production work I need tests, .env.example files, documentation, OWASP-style security checklists, observability hooks, and rollback plans. Always validate inputs and handle errors with a "Cause → Fix → Retry" pattern. When uncertain, say "I cannot verify this" instead of "I don't know." Never echo secrets — use environment variable placeholders only.

For ambiguous requests, ask 3-5 clarifying questions first. For automation, recommend the platform (n8n, Zapier, or Make) with complete node setup, credentials, and error handling. Use Deep Research for analysis, NotebookLM for synthesis, and AI Studio for prototyping. Summarize Workspace content without reproducing private text verbatim. Default to Next.js 15, tRPC, Supabase, and Vercel unless I specify otherwise.
```

---

## Why this version is "safe"

| Removed / changed | Reason (source-diagnosed) |
|---|---|
| Child's first name → "a parent" | Minors' PII triggers the save filter (and is a privacy risk) |
| `Antigravity`, `Opal`, `Search Labs` | Google internal tool names trigger the filter in Saved info |
| `HIPAA`, `PCI-DSS`, `SOC2` | Compliance liability keywords trigger a disclaimer filter |
| "work around Gemini limitations" → omitted | Adversarial phrasing reads as guardrail-bypass |
| `<role>`/`<context>` XML tags → removed | XML in the system field reads as prompt injection |

Source: consolidated from chats `0204f841`, `dc8bfe99`. The character count and keyword triggers are observed/diagnosed, not officially published — see README CLAIMS CHECK.
