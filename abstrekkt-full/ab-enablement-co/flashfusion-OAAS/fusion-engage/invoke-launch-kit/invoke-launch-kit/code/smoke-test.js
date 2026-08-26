// smoke-test.js
// Run this after every B44 deploy to verify the funnel end-to-end
// Usage: node smoke-test.js
// Requires: ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY in env

import { callAI, parseAIJson, getProviderForEcosystem, AI_MODELS } from './ai-models.js';

const BASE_URL = 'https://audit.flashfusion.co';
const ADMIN_EMAIL = 'kylerosebrook@gmail.com';

const TEST_PERSONA = {
  name: 'Sarah Kettner',
  email: 'sarah.test@smoketest.dev',
  company_name: 'Meridian Operations Group',
  ai_ecosystem: ['ChatGPT (OpenAI)', 'Copilot (Microsoft)'],
  ecosystem_primary: 'ChatGPT (OpenAI)',
  answers: { q1: '3', q2: '2', q3: '4', q4: '1', q5: '3', q6: '2', q7: '3', q8: '4', q9: '2', q10: '3' },
};

// ─────────────────────────────────────────────
// TEST SUITE
// ─────────────────────────────────────────────

async function runTests() {
  const results = [];
  let passed = 0;
  let failed = 0;

  function log(name, ok, detail = '') {
    const icon = ok ? '✅' : '❌';
    console.log(`${icon} ${name}${detail ? ' — ' + detail : ''}`);
    results.push({ name, ok, detail });
    ok ? passed++ : failed++;
  }

  console.log('\n🔍 INVOKE SMOKE TEST\n' + '─'.repeat(40));

  // ── TEST 1: Scoring calculation ──
  const sum = Object.values(TEST_PERSONA.answers).reduce((a, b) => a + parseInt(b), 0);
  const score = Math.round((sum / 40) * 100);
  const expectedBand = score <= 40 ? 'Early Stage' : score <= 65 ? 'Developing' : 'Advanced';
  log('Scoring calculation', score > 0 && score <= 100, `Score: ${score}/100 → ${expectedBand}`);

  // ── TEST 2: Provider routing ──
  const provider = getProviderForEcosystem(TEST_PERSONA.ecosystem_primary);
  log('Provider routing (OpenAI ecosystem)', provider === 'openai', `Routed to: ${provider}`);

  const claudeProvider = getProviderForEcosystem('Claude (Anthropic)');
  log('Provider routing (Claude ecosystem)', claudeProvider === 'anthropic', `Routed to: ${claudeProvider}`);

  const geminiProvider = getProviderForEcosystem('Gemini (Google)');
  log('Provider routing (Gemini ecosystem)', geminiProvider === 'gemini', `Routed to: ${geminiProvider}`);

  const copilotProvider = getProviderForEcosystem('Copilot (Microsoft)');
  log('Provider routing (Copilot → Claude fallback)', copilotProvider === 'anthropic', `Routed to: ${copilotProvider}`);

  // ── TEST 3: Claude API call ──
  console.log('\n📡 Testing AI providers...');
  try {
    const { text } = await callAI(
      `Answers: ${JSON.stringify(TEST_PERSONA.answers)}, ecosystem: ${TEST_PERSONA.ecosystem_primary}`,
      `You are an AI diagnostician. Return JSON: {"maturity_level":"Developing","overall_score":${score},"maturity_summary":"Test summary.","top_recommendations":["Rec 1","Rec 2","Rec 3"]}`,
      'anthropic'
    );
    const parsed = parseAIJson(text);
    log('Claude API call', !!parsed?.top_recommendations, `Score: ${parsed?.overall_score}`);
  } catch (err) {
    log('Claude API call', false, err.message);
  }

  // ── TEST 4: OpenAI API call ──
  if (process.env.OPENAI_API_KEY) {
    try {
      const { text } = await callAI(
        'Return JSON: {"test":"ok"}',
        'Return valid JSON only.',
        'openai'
      );
      const parsed = parseAIJson(text);
      log('OpenAI API call', !!parsed?.test, `Model: ${AI_MODELS.openai_primary}`);
    } catch (err) {
      log('OpenAI API call', false, err.message);
    }
  } else {
    log('OpenAI API call', false, 'OPENAI_API_KEY not set — skipped');
  }

  // ── TEST 5: Gemini API call ──
  if (process.env.GEMINI_API_KEY) {
    try {
      const { text } = await callAI(
        'Return JSON: {"test":"ok"}',
        'Return valid JSON only, no preamble.',
        'gemini'
      );
      const parsed = parseAIJson(text);
      log('Gemini API call', !!parsed?.test, `Model: ${AI_MODELS.gemini_primary}`);
    } catch (err) {
      log('Gemini API call', false, err.message);
    }
  } else {
    log('Gemini API call', false, 'GEMINI_API_KEY not set — skipped');
  }

  // ── TEST 6: n8n webhook reachability ──
  try {
    const res = await fetch('https://krosebrook.app.n8n.cloud/webhook/flashfusion-synthesis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'smoke_test', timestamp: new Date().toISOString() }),
    });
    log('n8n webhook reachable', res.status < 500, `HTTP ${res.status}`);
  } catch (err) {
    log('n8n webhook reachable', false, err.message);
  }

  // ── TEST 7: Landing page load ──
  try {
    const res = await fetch(BASE_URL);
    log('Landing page load', res.status === 200, `HTTP ${res.status}`);
  } catch (err) {
    log('Landing page load', false, err.message);
  }

  // ── RESULTS ──
  console.log('\n' + '─'.repeat(40));
  console.log(`RESULT: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.log('\n🚨 FAILED TESTS:');
    results.filter(r => !r.ok).forEach(r => console.log(`  • ${r.name}: ${r.detail}`));
  }
  console.log('');
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);
