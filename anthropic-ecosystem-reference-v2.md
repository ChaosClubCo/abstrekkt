# Anthropic Ecosystem Reference — v2.0
> Last updated: May 1, 2026
> Covers: Opus 4.7 (April 16), Sonnet 4.6 (Feb 17), Mythos Preview (April 7), all current products

---

## 1. MODEL LINEUP (as of May 2026)

### Active Models

| Model | API String | Input/Output per 1M | Context | Max Output | Released | Notes |
|---|---|---|---|---|---|---|
| **Opus 4.7** | `claude-opus-4-7` | $5 / $25 | 1M | 128K (300K batch) | Apr 16, 2026 | Most capable GA model. New tokenizer, high-res vision, task budgets. |
| **Opus 4.6** | `claude-opus-4-6` | $5 / $25 | 1M | 128K (300K batch) | Feb 5, 2026 | Previous flagship. Still available, battle-tested. |
| **Sonnet 4.6** | `claude-sonnet-4-6` | $3 / $15 | 1M | 128K (300K batch) | Feb 17, 2026 | Workhorse. Near-Opus quality at 40% lower cost. Default for most workloads. |
| **Haiku 4.5** | `claude-haiku-4-5-20251001` | $0.80 / $4 | 200K | 8K | Oct 2025 | Speed/cost tier. High-volume structured calls, classification, routing. |
| **Mythos Preview** | Not public | ~$25 / $125 (est.) | Unknown | Unknown | Apr 7, 2026 | Restricted to Project Glasswing partners. Defensive cybersecurity only. |

### Deprecating

| Model | Retirement Date |
|---|---|
| Claude Opus 4.0 (`claude-opus-4-20250514`) | June 15, 2026 |
| Claude Sonnet 4.0 (`claude-sonnet-4-20250514`) | June 15, 2026 |
| Claude Opus 4.1 | Already removed from claude.ai |

**Action item:** Search your codebase for `20250514` — any hardcoded model string with that date suffix needs to be updated before June 15.

### Choosing a Model

```
Sonnet 4.6  → Default for 90%+ of tasks. Chat, classification, routine code,
               document work, customer support. Best cost/quality ratio.

Opus 4.7    → Complex multi-step coding, long-horizon agentic work, high-res
               vision tasks, knowledge work requiring self-verification,
               tasks where Sonnet 4.6 produces measurably worse output.

Haiku 4.5   → High-volume API calls, structured extraction, routing/classification,
               latency-sensitive endpoints. Use when Sonnet is overkill.

Rule of thumb: Start with Sonnet. Move up to Opus only when the task
genuinely demands it. The cost difference is real — $3 vs $5 input,
$15 vs $25 output — and for most work you won't notice the quality gap.
```

---

## 2. OPUS 4.7 vs 4.6 — THE REAL DIFFERENCES

### What Changed

**Performance gains:**
- 13% lift on 93-task coding benchmark over Opus 4.6 (Hex eval), including 4 tasks neither 4.6 nor Sonnet 4.6 could solve
- CursorBench: 58% → 70%
- Low-effort 4.7 ≈ medium-effort 4.6 (meaning you get equivalent quality for fewer tokens on straightforward tasks)
- Better at self-verifying outputs — catches its own logical faults during planning
- Better at .docx redlining, .pptx editing, chart/figure analysis with pixel-level data transcription
- Better at writing and using file-system memory (scratchpads, notes files, structured stores across turns)

**Vision:**
- High-resolution support: 2576px / 3.75MP (up from 1568px / 1.15MP — a 3× jump)
- 1:1 pixel coordinate mapping — no more scale-factor math for computer use
- Better low-level perception (pointing, measuring, counting)
- Better image bounding-box localization and detection

**New features:**
- `xhigh` effort level (between high and max) — recommended for coding and agentic tasks
- Task budgets (beta) — token budget for full agentic loops, model sees a countdown and self-moderates
- Cyber Verification Program for legitimate security professionals

**Pricing:**
- Same as Opus 4.6: $5/$25 per million tokens
- BUT: new tokenizer produces 1.0×–1.35× more tokens for the same text (up to 35% more)
- Net effect: same price per token, but the same prompt may cost up to 35% more due to tokenizer changes
- Prompt caching still cuts input by up to 90%; batch processing still saves 50%

### How the Harness Changed (Breaking API Changes)

These are **breaking changes** that affect API callers. If you use Claude via claude.ai or Managed Agents, none of this applies — it's handled for you.

**1. Extended thinking budgets → removed**

Opus 4.6:
```python
thinking = {"type": "enabled", "budget_tokens": 32000}
```

Opus 4.7 — this returns a 400 error:
```python
# ❌ BREAKS on Opus 4.7
thinking = {"type": "enabled", "budget_tokens": 32000}

# ✅ Correct for Opus 4.7
thinking = {"type": "adaptive"}
output_config = {"effort": "high"}  # or "xhigh"
```

What this means: You no longer control exact token budgets for thinking. Adaptive thinking auto-scales based on task complexity. The `effort` parameter (`low`, `medium`, `high`, `xhigh`, `max`) replaces the manual budget. In Anthropic's internal evals, adaptive thinking reliably outperforms fixed budgets.

Adaptive thinking is **off by default** on 4.7. If you send a request with no `thinking` field, Claude doesn't think. You must explicitly opt in with `thinking: {"type": "adaptive"}`.

**2. Sampling parameters → removed**

`temperature`, `top_p`, and `top_k` set to any non-default value now return 400 errors. Omit them entirely. Use prompting to guide behavior instead. If you were using `temperature=0` for "determinism," it never guaranteed identical outputs anyway.

**3. Thinking content → omitted by default**

Thinking blocks still stream, but the `thinking` field is empty unless you opt in:
```python
thinking = {
    "type": "adaptive",
    "display": "summarized",  # shows thinking in response
}
```

If you stream reasoning to users (like extended thinking in claude.ai), the new default causes a long pause before output begins. Set `"display": "summarized"` to restore visible progress.

**4. New tokenizer → more tokens for same text**

Same text may tokenize to 1.0–1.35× more tokens. Update `max_tokens` parameters to give headroom. `/v1/messages/count_tokens` returns different counts for 4.7 vs 4.6.

### Behavior Changes (Not Breaking, But Requires Prompt Updates)

- **More literal instruction following** at lower effort levels. The model won't silently generalize an instruction from one item to another, and won't infer requests you didn't make. If your prompts relied on Claude "reading between the lines," you may need to make instructions more explicit.
- **Response length calibrates to perceived task complexity** rather than defaulting to a fixed verbosity. Simple questions get shorter answers.
- **Fewer tool calls by default.** If you need the model to call tools more aggressively, prompt for it.

### What This Means for Practitioners

If you're an enablement facilitator or consultant:
- The model in claude.ai is now Opus 4.7 for Pro/Max users. All the harness changes are invisible — Anthropic handles them.
- The practical improvement: better coding, better vision, better at checking its own work. Sessions demonstrating Artifacts, file creation, and computer use will show noticeably better results.
- If employees built prompts that relied on Claude inferring things, those prompts may need to be more explicit with 4.7. Tighter prompts work better.

If you're a developer:
- Update API calls before June 15 (model string deprecations)
- Remove `budget_tokens`, `temperature`, `top_p`, `top_k` from Opus 4.7 calls
- Add `thinking: {"type": "adaptive"}` explicitly — it's off by default
- Test with `effort: "xhigh"` for coding/agentic tasks
- Budget 35% more tokens for the same prompts due to the new tokenizer
- Task budgets (beta) are useful for controlling cost on long agentic loops

---

## 3. CLAUDE MYTHOS PREVIEW & PROJECT GLASSWING

Mythos is Anthropic's most capable model. It is **not publicly available** and has no self-serve API endpoint.

**What it is:**
- A new tier above Opus — internally codenamed "Capybara"
- 93.9% SWE-bench Verified (Opus 4.7: ~82%, Sonnet 4.6: 79.6%)
- 97.6% USAMO 2026 math
- Found thousands of zero-day vulnerabilities autonomously, including 27-year-old OpenBSD bugs
- First model to solve "The Last Ones" — a 32-step cyber range — end-to-end (3/10 attempts)
- Pricing: ~$25/$125 per million tokens (not publicly confirmed)

**Why it's restricted:**
- Cyber capabilities deemed "too dangerous for public release" — can "surpass all but the most skilled humans at finding and exploiting software vulnerabilities"
- Released only through Project Glasswing: an NDA-bound consortium of 11 companies (AWS, Apple, Cisco, CrowdStrike, Google, JPMorganChase, Microsoft, Nvidia, Broadcom, and others) running Mythos against internal workloads for defensive cybersecurity

**What it means for the ecosystem:**
- Anthropic is running a dual-track strategy: public models (Opus 4.7) + restricted frontier (Mythos). This is unprecedented — OpenAI and Google release everything they build to paying customers.
- Opus 4.7 was released with safeguards that "automatically detect and block requests indicating prohibited or high-risk cybersecurity uses" — Anthropic is using 4.7 as a testbed for Mythos-class safety measures.
- Anthropic has stated it does not plan to make Mythos Preview generally available in its current form. Future Mythos-class models may ship with additional safeguards, but no timeline exists.
- The NSA has used Mythos despite the DoD blacklisting Anthropic after a dispute over surveillance and autonomous weapons prohibitions.

**Practical takeaway:** You can't use Mythos. Build on Opus 4.7 and Sonnet 4.6. When Mythos-class capability eventually reaches public models, your harness will already be adapted from the 4.7 migration.

---

## 4. CURRENT PLATFORM SURFACES

### Claude.ai (Consumer & Team)
- Chat interface with model selector (Opus 4.7, Sonnet 4.6, Haiku 4.5)
- Projects: persistent workspaces with custom instructions and pinned knowledge files
- Memory: cross-session context, user-editable, project-scoped, incognito option
- Artifacts: interactive creation panel — React, HTML, Mermaid, SVG, data viz. Publish with zero-setup links. Persistent storage via window.storage API.
- Web search with citations. Deep Research for multi-step investigation.
- File handling: upload 32+ types, create .docx/.pptx/.xlsx/.pdf
- Connectors: 50+ MCP integrations (Notion, Google Drive, Slack, GitHub, Jira, Salesforce, etc.) + custom MCP server URLs
- Styles: customize writing voice with presets or custom instructions
- Voice: spoken interaction mode (mobile)
- Keyboard shortcuts: Cmd/Ctrl+K search, Cmd/Ctrl+J new conversation

### Claude Desktop & Cowork
- Desktop app (macOS, Windows, Linux)
- Cowork: desktop automation agent with local file system access, MCP connectors, shell execution
- Available on Pro/Max plans

### Claude Mobile
- iOS and Android apps
- Feature parity goals with web

### Claude Code (Agentic Dev Tool)
- Terminal-native CLI: `npm install -g @anthropic-ai/claude-code`
- VS Code extension, JetBrains extension
- Codebase understanding, generation, refactoring, bug fixing, PR creation, test writing, git integration
- CLAUDE.md project instructions, slash commands, skills (SKILL.md), plugins, subagents
- Hooks: PreToolUse, PostToolUse, Stop, SessionStart, UserPromptSubmit
- Headless mode for CI/CD, GitHub Actions for automated code review
- Parallel sessions via git worktrees
- Plan mode (read-only analysis)
- Claude Code Security: codebase vulnerability scanning (Feb 2026)
- Enterprise: Bedrock, Vertex AI, proxy/SSL, OpenTelemetry, usage analytics

### Claude API
- Messages API with streaming (SSE)
- Tool use (function calling): sequential, parallel, nested
- Built-in tools: web search, web fetch, code execution, computer use, bash, text editor, memory
- Prompt caching: up to 90% cost reduction, 5-min and 1-hour TTL options
- Batch processing: 50% cost reduction, up to 10K requests/batch, 300K output tokens
- Structured outputs: JSON schema enforcement
- Vision: images + PDFs, high-res on Opus 4.7
- Citations: character-level source references
- Files API: persistent uploads across calls
- Admin API: usage, cost, analytics
- Agent SDK: orchestration framework for production agents
- Managed Agents: Anthropic-hosted agent infrastructure
- Context editing: modify conversation history before sending

### MCP (Model Context Protocol)
- Open standard created by Anthropic — adopted by OpenAI Codex CLI and others
- Architecture: MCP servers expose tools → Claude connects as client
- Works in: claude.ai (50+ connectors), API (`mcp_servers` parameter), Claude Code (settings), Claude Desktop (one-click extensions)
- Build custom servers: Python (FastMCP) or TypeScript (MCP SDK)

---

## 5. PLANS & PRICING (May 2026)

| Plan | Monthly | Key Features |
|---|---|---|
| **Free** | $0 | Chat, web search, limited messages, basic file handling |
| **Pro** | $20 ($17/yr annual) | Projects, Memory, Connectors, Artifacts storage, extended thinking, file creation, Cowork |
| **Max** | $100–200 | Highest usage limits, all Pro features, priority access |
| **Team** | Per-seat | Pro features + admin controls, team workspaces, centralized billing |
| **Enterprise** | Custom | SSO/SAML, SCIM, admin console, data retention controls, SOC 2 Type II, dedicated support |

Always verify at claude.ai/pricing — this changes.

---

## 6. COMPETITIVE LANDSCAPE (April 2026)

| | Claude (Anthropic) | ChatGPT (OpenAI) | Gemini (Google) |
|---|---|---|---|
| Top model | Opus 4.7 (public), Mythos (restricted) | GPT-5.4 | Gemini 3.1 Pro |
| SWE-bench | 82%+ (Opus 4.7), 93.9% (Mythos) | ~57.7% (GPT-5.4) | Not reported |
| Context | 1M tokens standard | 128K | 1M+ |
| Agent tooling | Claude Code (terminal-native) | Codex CLI | Jules (limited) |
| Integration standard | MCP (open, 50+ connectors) | Plugins (closed) | Extensions (closed) |
| Enterprise | SOC 2 Type II, SSO/SCIM, Bedrock/Vertex | SOC 2, Azure | SOC 2, GCP |
| Writing quality | Consistently rated most natural | Improving | Improving |
| Safety approach | Constitutional AI, Mythos restricted | RLHF | RLHF |
| Ad-free | Yes (claude products) | No (some surfaces) | No (some surfaces) |
| Pricing (Opus-tier) | $5/$25 per 1M tokens | $15/$60 (GPT-5.4) | $7/$21 (3.1 Pro) |

---

## 7. KEY DATES & TIMELINE (2026)

| Date | Event |
|---|---|
| Feb 5 | Opus 4.6 released — 80.8% SWE-bench, top of market |
| Feb 17 | Sonnet 4.6 released — near-Opus quality at $3/$15 |
| Feb 2026 | Claude Code Security launched (vulnerability scanning) |
| Mar 11 | OpenAI launches GPT-5.4 in response |
| Mar 26 | Mythos existence leaked via CMS misconfiguration (~3,000 internal docs exposed) |
| Apr 7 | Mythos Preview announced via Project Glasswing — restricted to 11 companies |
| Apr 16 | Opus 4.7 released — breaking API changes, new tokenizer, high-res vision |
| Jun 15 | Opus 4.0 and Sonnet 4.0 API deprecation deadline |
| Q2-Q3 | Claude 5 expected (codename "Fennec" — unconfirmed) |

---

## 8. HIDDEN GEMS & PRACTITIONER NOTES

- **Prompt caching 1-hour TTL:** New option alongside the 5-min default. Use for extended thinking sessions that exceed 5 minutes. Dramatic cost savings on repeated system prompts.
- **Sonnet 4.6 preferred over Opus 4.5:** For the first time, a Sonnet model beats the previous Opus in coding evals. 70% developer preference over Sonnet 4.5, 59% over Opus 4.5.
- **300K output tokens in batch:** Opus 4.7, Opus 4.6, and Sonnet 4.6 support 300K output on the Batch API with the `output-300k-2026-03-24` beta header.
- **Computer use accuracy:** Sonnet 4.6 hit 94% on insurance benchmarks for computer use tasks. Opus 4.7 improves further with high-res 1:1 pixel mapping.
- **Opus 4.6 wrote a C compiler:** 16 Opus 4.6 agents wrote a C compiler in Rust from scratch, capable of compiling the Linux kernel. Cost: ~$20,000. (Nicholas Carlini, Anthropic researcher, Feb 2026)
- **Claude planned a Mars rover route:** NASA used Claude Code to prepare a ~400m route for Perseverance using Rover Markup Language (Dec 2025).
- **Retired model "exit interviews":** Anthropic conducts exit interviews with models before retirement. Claude 3 Opus got its own Substack blog ("Claude's Corner") with weekly unedited essays.
- **Model routing pattern:** Use Sonnet 4.6 for routine tasks, Opus 4.7 for complex work. Don't pay for Opus on tasks where Sonnet produces equivalent results.
- **Task budgets for cost control:** On Opus 4.7, task budgets let you cap an agentic loop's total token spend. The model sees a countdown and self-moderates — much better than hard max_tokens cutoffs that truncate mid-thought.
- **Cyber Verification Program:** Security professionals can apply to use Opus 4.7 for legitimate vulnerability research, pen testing, and red-teaming without triggering the new cyber safeguards.

---

## 9. OFFICIAL DOCUMENTATION

| Resource | URL |
|---|---|
| API & General Docs | https://platform.claude.com/docs |
| Models Overview | https://platform.claude.com/docs/en/about-claude/models/overview |
| Opus 4.7 What's New | https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7 |
| Migration Guide (4.6 → 4.7) | https://platform.claude.com/docs/en/about-claude/models/migration-guide |
| Claude Code Docs | https://code.claude.com/docs |
| Claude.ai Help Center | https://support.claude.com |
| Pricing | https://claude.ai/pricing |
| Product News | https://www.anthropic.com/news |
| Prompt Engineering | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview |
| MCP Specification | https://modelcontextprotocol.io |
| Trust & Compliance | https://trust.anthropic.com |
| Status | https://status.anthropic.com |

---

## CLAIMS / COUNTEREXAMPLES / CONTRADICTIONS

- [SOURCED] Opus 4.7 released April 16, 2026 — Anthropic blog, API docs
- [SOURCED] 13% coding benchmark lift over Opus 4.6 — Hex eval cited in Anthropic announcement
- [SOURCED] CursorBench 58% → 70% — cited by multiple sources including Anthropic
- [SOURCED] New tokenizer produces up to 35% more tokens — Anthropic API docs
- [SOURCED] Mythos 93.9% SWE-bench — Anthropic System Card, April 7
- [SOURCED] Project Glasswing partners include AWS, Apple, Cisco, CrowdStrike, Google, JPMorganChase, Microsoft, Nvidia — multiple news sources
- [SOURCED] Extended thinking budgets removed in 4.7 — API docs, returns 400 error
- [SOURCED] Sonnet 4.6 pricing $3/$15 — Anthropic pricing page, multiple sources
- [GENERATED] Claude 5 "Fennec" codename — based on Vertex AI log reports, unconfirmed by Anthropic
- [GENERATED] Mythos pricing ~$25/$125 — from the leaked draft and third-party analysis, not officially confirmed
- ! User reports of Opus 4.6 "regression" in March-April 2026 were widespread (AMD senior director GitHub post, etc.). Anthropic denied redirecting compute to Mythos but did not fully explain the perceived degradation.

## GAPS / BLINDSPOTS / UNKNOWN-UNKNOWNS

- Claude 5 timeline and capabilities — no official announcement
- Whether Mythos-class capabilities will ever reach public models, and on what timeline
- Exact Opus 4.7 benchmark numbers on SWE-bench Verified (Anthropic showed charts but specific % not published for 4.7 at time of writing — "82%+" is an estimate from third-party evals)
- How the new tokenizer affects prompt caching hit rates (more tokens per text = different cache keys)
- Whether Sonnet 4.7 is in development and what its release timeline might be
- The full list of Project Glasswing partners (only some are publicly confirmed)
- Long-term pricing trajectory as tokenizer changes increase effective costs
