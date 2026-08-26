# Claude Profile Setup — Top 15 Steps
> All audiences · All plan tiers · All surfaces | April 2026

---

## Plan Gates Quick Reference

| Tier | Price | Unlocks |
|---|---|---|
| **Free** | $0 | Chat, web search, basic memory, styles |
| **⭐ Pro** | $20/mo ($17 annual) | Projects, Memory edits, Connectors, Artifacts storage, Cowork, Claude Code, Claude Design |
| **💎 Max** | $100–200/mo | Pro + 5× or 20× usage limits, early features |
| **👥 Team** | Per seat | Pro + admin controls, shared workspaces, centralized billing |
| **🏢 Enterprise** | Custom | SSO/SAML, SCIM, admin console, data retention, SOC 2 Type II, group permissions |

---

## The 15 Setup Milestones

### 1. Create Account 🆓
- Sign up at **claude.ai** using your work/org email
- Download desktop app: **claude.com/download** (macOS + Windows)
- Mobile: iOS App Store / Google Play Store
- ✓ Account created · Work email confirmed

---

### 2. Verify / Upgrade Plan 🆓→⭐
- Settings → Plan (avatar, bottom-left)
- Free: chat, web search, basic memory only
- Pro: everything you need for productive daily use
- Team/Enterprise: **anthropic.com/contact-sales**
- ✓ Plan tier confirmed

---

### 3. Account Setup 🆓
- Settings → Account: confirm work email, set display name
- Settings → Privacy: review data settings
- Enterprise: verify SSO setup with IT
- ✓ Work email confirmed · Display name set · Privacy reviewed

---

### 4. Enable Memory 🆓
- Settings → Memory & Integrations
- Toggle **Memory** ON
- Toggle **Memory from chat history** ON
- ✓ Both toggles enabled · Existing memories reviewed

---

### 5. Write Memory Edits ⭐ (basic on Free)
**Format:** Imperative second-person statements
- `"User is [Name], [Role] at [Org]."`
- `"User prefers concise responses without bullet points."`
- `"User works primarily in [stack/tools/domain]."`
- `"User's active projects are [X, Y, Z]."`
- `"User never wants Claude to [specific prohibition]."`

Write **3–5 minimum**. Test in a new conversation.

---

### 6. Create First Project ⭐ Pro+
- Left sidebar → **+ New Project**
- Name by context: "Work — [Role]", "Client X", "[Initiative]"
- Add icon/color for navigation
- Each project = separate memory namespace + instructions + pinned files
- ✓ 1+ project created

---

### 7. Set Project Custom Instructions ⭐ Pro+
Project → gear icon → Project instructions

Write your persistent system prompt. Be specific:
- Role and organizational context
- Output format preferences (length, structure, tone)
- Domain-specific rules or style constraints
- Tools/stack/style guide references
- Explicit prohibitions

Test: open a conversation in the project → verify Claude follows instructions.

---

### 8. Pin Knowledge Files ⭐ Pro+
Project → paperclip icon → Upload files

Pin: SOPs, style guides, data schemas, team glossaries, brand docs
- Supported: PDF, DOCX, CSV, TXT, images, code files
- Enterprise: pin org-wide knowledge across all projects
- ✓ 1+ knowledge file pinned and accessible

---

### 9. Configure Writing Style 🆓
Settings → Writing style (or in-conversation style selector)

- **Presets:** Concise, Explanatory, Formal, Casual
- **Custom:** describe voice, tone, vocabulary level, formatting rules
- Can be overridden per conversation without changing default

---

### 10. MCP Connector Setup ⭐ Pro+
Settings → Connectors

| Audience | Start with |
|---|---|
| All users | Google Drive, Notion, Slack/Teams |
| Developers | + GitHub, Vercel, Sentry, Linear, Cloudflare, n8n |
| Power users | + HubSpot, Jira, Asana, Calendly, Airtable |
| Custom | Add any MCP URL: Settings → Connectors → Add custom server |

**Fix 403 errors:** disconnect → reconnect (session expiry, not permissions)

---

### 11. Install Desktop App ⭐ Pro+
Download: **claude.com/download**

Three tabs:
| Tab | What it does | Requires |
|---|---|---|
| **Chat** | Full claude.ai in desktop | Pro |
| **Cowork** | Autonomous task agent | Pro |
| **Code** | Claude Code (coding agent) | Pro |

Computer use (direct desktop control): Settings → General → enable
- Pro/Max only — NOT available on Team/Enterprise at launch (research preview)

---

### 12. Configure Cowork ⭐ Pro+
*(Non-technical and knowledge workers — skip if developer-only)*

Desktop app → **Cowork** tab
- Grant folder access before first task
- First test: *"Organize my Downloads folder — show me the plan first"*
- **Dispatch:** Install Claude mobile app → enable persistent agent thread → assign tasks from phone
- **Scheduled tasks:** define cadence once, Claude runs it
- Computer use priority: connectors → browser → direct desktop screen

---

### 13. Claude Code Setup ⭐ Pro+
*(Developers — skip if non-technical)*

```bash
npm install -g @anthropic-ai/claude-code
claude          # first run triggers OAuth login
```

In every project repo:
```bash
# Create CLAUDE.md with project context
claude "what files are in this repo?"   # first test
```

Key paths:
- Global settings: `~/.claude/settings.json`
- VS Code extension: search "Claude Code" in Extensions
- API key: **platform.claude.com**
- Docs: **code.claude.com/docs**

---

### 14. QC Gate — Verify All Critical Items
Run before declaring setup complete.

| Item | Audience | Required |
|---|---|---|
| Account on work/org email | All | ★ Critical |
| Memory enabled with 3+ edits | All | ★ Critical |
| 1+ Project with custom instructions (tested) | All | ★ Critical |
| Writing style configured | All | Recommended |
| 1+ MCP connector connected and tested | Pro+ | Recommended |
| Desktop app installed | Cowork/Code users | Recommended |
| Claude Code working from terminal | Developers | Recommended |

---

### 15. Setup Complete
- Copy session summary if onboarding someone else
- Document anything skipped and why
- Return here when upgrading plan or adding new surfaces

**Surface coverage checklist:**
- [ ] claude.ai (web)
- [ ] Claude Desktop (Chat + Cowork + Code tabs)
- [ ] Claude Mobile (iOS/Android)
- [ ] Claude Code (CLI) — developers
- [ ] API / platform.claude.com — developers
- [ ] Claude for Chrome — browser automation
- [ ] Claude Design — visual work (claude.ai/design)

---

## Common Setup Failures

| Symptom | Fix |
|---|---|
| Projects not visible | Upgrade to Pro ($20/mo) |
| Memory edits missing | Settings → Memory & Integrations → Manage Memories |
| Connector 403 error | Disconnect → reconnect (session expiry) |
| Claude Code command not found | `npm install -g @anthropic-ai/claude-code` |
| Computer use unavailable | Pro/Max only; Team/Enterprise excluded at launch |
| SSO not working | Contact IT; verify SAML config in Enterprise admin console |

---

## Quick Links

| Resource | URL |
|---|---|
| Sign up / pricing | claude.ai / claude.ai/pricing |
| Desktop app download | claude.com/download |
| Claude Design | claude.ai/design |
| API platform | platform.claude.com |
| Claude Code docs | code.claude.com/docs |
| MCP spec | modelcontextprotocol.io |
| Help center | support.claude.com |
| Enterprise / sales | anthropic.com/contact-sales |

---

*As of April 2026. Verify current plan pricing and feature availability at claude.ai/pricing.*
