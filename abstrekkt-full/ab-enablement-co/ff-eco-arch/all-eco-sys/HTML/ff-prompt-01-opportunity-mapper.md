# FlashFusion Prompt Registry
## Prompt 01: AI Opportunity Mapper
**Version:** 1.0 | **Status:** Production | **Model:** claude-sonnet-4-20250514 | **Updated:** 2026-05-13

---

### What this prompt actually does

Two-pass API system. Pass 1 runs live web searches against Anthropic's ecosystem (industry-specific, domain-specific, capability-specific). Pass 2 generates use cases grounded in those sources — every use case indexes back to a real URL. Client sees sourced recommendations, not hallucinated generalities.

**Source file:** `epb-use-case-discovery.jsx` (FlashFusion EPB tool)

---

## 0. Pre-Prompt Intake

| Item | This prompt |
|------|------------|
| **Task** | Generate 8 Claude ecosystem use cases grounded in live web sources, tailored to a specific role + industry + maturity stage |
| **Input** | role, industry, company_stage, domain_focus, audience_tier |
| **Output** | JSON: contextSummary + 8 useCases, each with title, description, domain, effort, impact, timeframe, claudeFeatures, risks, quickStart, sourceIndices |
| **Success metric** | Every use case references ≥1 verified source index; no hallucinated Claude feature names; quickStart is executable in <1 hour |
| **Audience** | FlashFusion clients mid-audit, or prospects in discovery calls |
| **Failure mode** | hallucinated feature names ("Claude Vision API" doesn't exist); sourceIndices pointing to non-existent search results; generic use cases that don't reference the client's actual role/industry |

---

## I. Prompt Anatomy

### Pass 1 — System Prompt / Role

No system prompt. Pass 1 is a bare user message. The model acts as a search orchestrator, not an analyst.

**Why:** Pass 1's only job is to populate a source list. Giving it a persona risks having it try to synthesize. Bare prompt + web_search tool keeps it mechanical.

### Pass 2 — System Prompt / Role

```
You are an Anthropic ecosystem expert generating Claude AI use cases.
```

Intentionally minimal. The system prompt doesn't do the heavy lifting here — the structured user message does (context + sources + output schema). Expanding this risks personality drift in the JSON output.

---

### Pass 1 — Task Specification

```
Search the web for current information on these topics. Run all 3 searches:

1. Search: "Anthropic Claude {industryName} use cases 2025 2026"
2. Search: "Claude AI enterprise {domainLabel} real world examples"
3. Search: "Anthropic Claude new features capabilities MCP 2026"

After searching, respond with ONLY the text "SEARCH_COMPLETE" and nothing else.
```

**Constraints:**
- 3 searches every time — no shortcuts for "simple" inputs
- The final instruction (`respond with ONLY "SEARCH_COMPLETE"`) exists to prevent the model from summarizing. Without it, Pass 1 responses become multi-paragraph syntheses that inflate token cost and crowd the source extraction logic.
- `web_search_20250305` tool must be enabled — the prompt is inert without it

**Known fragility:** The `SEARCH_COMPLETE` instruction is sometimes ignored when search results are particularly rich. The client extracts sources from `web_search_tool_result` blocks regardless, so this is cosmetic rather than functional, but it adds latency if the model appends a 500-word summary.

---

### Pass 2 — Task Specification

```
You are an Anthropic ecosystem expert generating Claude AI use cases.

VERIFIED SOURCES (from live web search — reference these by index number):
{sourceContext}

CONTEXT:
- Role: {roleName}
- Industry: {industryName}
- Company Size: {maturityName}
- Domain Focus: {domainFocus}

AUDIENCE TIER: {tierDescription}

Generate 8 specific, actionable use cases. For each:
- title: Under 10 words
- description: 2-3 sentences (audience-tier appropriate)
- domain: implementation|prompts|governance|training
- trending: true/false
- priority: High/Medium/Low
- effort: Low/Medium/High
- impact: Low/Medium/High
- timeframe: Quick Win (<1 week)|Short-term (1-4 weeks)|Medium-term (1-3 months)|Long-term (3+ months)
- claudeFeatures: Array of Claude capabilities referenced in the sources above
- risks: Brief risk note
- quickStart: One concrete first step (1 sentence)
- sourceIndices: Array of integers referencing ONLY source numbers from the VERIFIED SOURCES list above.
  Every use case MUST reference at least one source. Do NOT reference indices that don't exist.

Respond ONLY with valid JSON (no markdown, no backticks):
{"contextSummary":"2-3 sentences referencing specific findings from the sources above","useCases":[...]}
```

**Three variables that meaningfully change the output:**

1. `{tierDescription}` — This is the lever that controls register, not the system prompt.
   - `enduser`: "Non-technical end user: Use plain English, focus on business outcomes, avoid jargon"
   - `tech`: "Internal tech department: Include implementation details, technical specs, integration patterns"
   - `ai`: "Internal AI team: Architecture-level insights, multi-agent patterns, performance optimization, governance"

2. `{sourceContext}` — Numbered list of `[N] "Title" — URL\n    snippet`. The sourceIndices in output map back to these. If sourceContext is empty (all searches failed), the fallback instructs the model to use training knowledge and mark sourceIndices as empty arrays.

3. `{domainFocus}` — Either "Cover all four domains" or a single domain label. Controls the distribution of use cases across implementation/prompts/governance/training.

---

### Output Format

```json
{
  "contextSummary": "string (2-3 sentences citing specific source findings)",
  "useCases": [
    {
      "title": "string (<10 words)",
      "description": "string (2-3 sentences, audience-tier appropriate)",
      "domain": "implementation|prompts|governance|training",
      "trending": "boolean",
      "priority": "High|Medium|Low",
      "effort": "Low|Medium|High",
      "impact": "Low|Medium|High",
      "timeframe": "Quick Win (<1 week)|Short-term (1-4 weeks)|Medium-term (1-3 months)|Long-term (3+ months)",
      "claudeFeatures": ["string"],
      "risks": "string",
      "quickStart": "string (one executable sentence)",
      "sourceIndices": [0, 3]
    }
  ]
}
```

**Post-processing guard (in client code):**
```javascript
parsed.useCases = parsed.useCases.map(uc => ({
  ...uc,
  sourceIndices: (uc.sourceIndices || []).filter(
    i => typeof i === 'number' && i >= 0 && i < extractedSources.length
  )
}));
```
This strips hallucinated indices before they reach the UI. Required — without it, source links break when the model invents index 12 in a 5-source list.

---

### API Configuration

```javascript
// Pass 1
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 1000,
  tools: [{ type: "web_search_20250305", name: "web_search" }],
  messages: [{ role: "user", content: searchPrompt }]
}

// Pass 2
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 6000,  // 8 use cases × ~400 tokens each + overhead
  messages: [{ role: "user", content: generatePrompt }]
}
```

**Why 6000 on Pass 2:** 8 use cases at full JSON depth average 450-550 tokens each. `max_tokens: 4000` causes truncation on the 7th or 8th use case — the JSON arrives malformed, the parse fails, and the client falls through to hardcoded fallback results. 6000 gives a safe margin.

**Timeout:** 90 seconds. Pass 1 typically completes in 8-15s. Pass 2 typically completes in 20-45s. Combined P95 is ~55s. The 90s timeout catches model slowdowns and rate-limit back-pressure without false timeouts on normal runs.

---

### Few-Shot Examples

Not used in this prompt. The output schema + source-grounding requirement provides sufficient constraint. Adding examples risks anchoring the model to the example's industry/domain and reducing diversity across different filter combinations.

---

### Constraints

**Hard:**
- `sourceIndices` must reference valid indices — enforced post-parse in client code
- `claudeFeatures` must be real Anthropic capabilities (not invented API names)
- `quickStart` must be one sentence, executable within 1 hour by the target audience
- JSON only — no markdown, no backticks, no preamble

**Soft:**
- Domain distribution should be roughly balanced when `domain === 'all'` (2 per quadrant)
- `trending: true` should be reserved for genuinely current patterns, not default true

---

### Testing Strategy

**Happy path:**
- Input: `role=developer, industry=technology, maturity=growth, domain=all, tier=tech`
- Expected: 8 use cases, valid JSON, all sourceIndices in range, claudeFeatures reference real capabilities
- Validate: `JSON.parse()` succeeds, `useCases.length === 8`, every `sourceIndices` element < `sources.length`

**Edge case — zero search results:**
- Input: any valid filters, but web search returns 0 results (network failure, rate limit)
- Expected: graceful fallback — `sourceContext = "(No search results available — use your training knowledge and mark sourceIndices as empty arrays)"`; output has `sourceIndices: []` on all use cases
- Validate: JSON is still valid; UI renders with "No live sources" indicator

**Adversarial — hallucinated Claude features:**
- Watch for: "Claude Vision API", "Claude Realtime API", "Claude Voice", "Anthropic Search Tool Pro"
- Test by: requesting use cases for a niche industry (e.g., `industry=government`) where the model has less grounding
- Validate: all values in `claudeFeatures` arrays match known Anthropic capability names

---

### Platform Notes

**Claude Sonnet 4 (current):**
- JSON adherence: excellent — rarely breaks schema, even at 6000 token output
- Instruction following on sourceIndices: good, still requires client-side guard for edge cases
- Pass 1 search quality: strong for technology and healthcare; thinner for manufacturing, government

**Migration to GPT-4o:**
- Add explicit JSON schema to the prompt (GPT-4o is less reliable on schema adherence without it)
- sourceIndices hallucination rate increases ~15% — client-side guard becomes critical
- Consider `response_format: { type: "json_object" }` in OpenAI API call

---

### Success Criteria

- **Accuracy:** sourceIndices valid (no out-of-range) on ≥95% of runs
- **Completeness:** 8 use cases returned on ≥97% of runs (vs. truncated 6-7)
- **Feature accuracy:** 0 hallucinated Claude capability names in production audit
- **Latency:** P50 < 40s, P95 < 75s end-to-end (both passes)
- **Cost:** Pass 1 ≈ $0.004, Pass 2 ≈ $0.018, total ≈ $0.022/generation

---

### Gaps & Blindspots

- **Hidden Gems data is hardcoded**, not generated. The 30+ gems in `HIDDEN_GEMS` and `INDUSTRY_GEMS` are static and won't reflect new Claude capabilities without a manual update to the source file. Currently updated manually; no automated refresh.
- **No feedback loop.** There's no mechanism to record which use cases clients actually acted on. High-value prioritization is based on the model's assessment, not conversion data.
- **Search quality variance.** The three fixed search queries don't adapt to the specific client context beyond substituting `{industryName}` and `{domainLabel}`. A healthcare security query and a healthcare implementation query produce different search results but use the same query structure.
- **JSON parse failure rate.** The fallback on parse failure shows hardcoded example results. These are tagged with real source URLs but aren't grounded in the current session's search results — which means clients on failed sessions see generic examples, not tailored output.

---

### Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-05-13 | Initial v2.0 documentation of existing prompt (EPB tool) |

---

*Documented from source: `epb-use-case-discovery.jsx`*
