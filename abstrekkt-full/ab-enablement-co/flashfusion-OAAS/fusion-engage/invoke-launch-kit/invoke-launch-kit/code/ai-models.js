// ai-models.js
// Single source of truth for all AI provider configuration
// Update model strings HERE ONLY — propagates everywhere

// ─────────────────────────────────────────────
// MODEL REGISTRY
// ─────────────────────────────────────────────

export const AI_MODELS = {
  // Anthropic (Claude) — primary for all report generation
  primary: 'claude-sonnet-4-6',
  fast: 'claude-haiku-4-5-20251001',

  // OpenAI — used when ecosystem_primary is ChatGPT/OpenAI
  openai_primary: 'gpt-4o',
  openai_fast: 'gpt-4o-mini',

  // Google Gemini — used when ecosystem_primary is Gemini/Google
  gemini_primary: 'gemini-2.0-flash',
  gemini_fast: 'gemini-1.5-flash',
};

// ─────────────────────────────────────────────
// PROVIDER ROUTER
// Maps ecosystem_primary value → provider key
// ─────────────────────────────────────────────

export function getProviderForEcosystem(ecosystemPrimary) {
  if (!ecosystemPrimary) return 'anthropic';
  const lower = ecosystemPrimary.toLowerCase();
  if (lower.includes('openai') || lower.includes('chatgpt')) return 'openai';
  if (lower.includes('gemini') || lower.includes('google')) return 'gemini';
  return 'anthropic'; // Claude, Copilot, Meta, None → default to Claude
}

// ─────────────────────────────────────────────
// UNIFIED callAI FUNCTION
// Returns { text: string } regardless of provider
// ─────────────────────────────────────────────

export async function callAI(prompt, systemPrompt, provider = 'anthropic') {
  try {
    switch (provider) {
      case 'anthropic':
        return await callAnthropic(prompt, systemPrompt);
      case 'openai':
        return await callOpenAI(prompt, systemPrompt);
      case 'gemini':
        return await callGemini(prompt, systemPrompt);
      default:
        console.warn(`Unknown provider "${provider}", falling back to anthropic`);
        return await callAnthropic(prompt, systemPrompt);
    }
  } catch (err) {
    console.error(`callAI error [${provider}]:`, err.message);
    // Fallback chain: openai → anthropic, gemini → anthropic
    if (provider !== 'anthropic') {
      console.warn(`Falling back to anthropic after ${provider} failure`);
      return await callAnthropic(prompt, systemPrompt);
    }
    throw err;
  }
}

// ─────────────────────────────────────────────
// PROVIDER IMPLEMENTATIONS
// ─────────────────────────────────────────────

async function callAnthropic(prompt, systemPrompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: AI_MODELS.primary,
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
  const data = await res.json();
  const text = data.content?.find(b => b.type === 'text')?.text ?? '';
  return { text };
}

async function callOpenAI(prompt, systemPrompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODELS.openai_primary,
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  return { text };
}

async function callGemini(prompt, systemPrompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODELS.gemini_primary}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${prompt}` }],
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return { text };
}

// ─────────────────────────────────────────────
// SAFE JSON PARSER
// Strips markdown fences before parsing
// ─────────────────────────────────────────────

export function parseAIJson(text) {
  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('parseAIJson failed:', err.message);
    console.error('Raw text:', text);
    return null;
  }
}
