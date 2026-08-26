// --- block 8 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaMessageTokensCount = await client.beta.messages.countTokens({
  messages: [{ content: 'Hello, world', role: 'user' }],
  model: 'claude-opus-4-6',
});

console.log(betaMessageTokensCount.context_management);
