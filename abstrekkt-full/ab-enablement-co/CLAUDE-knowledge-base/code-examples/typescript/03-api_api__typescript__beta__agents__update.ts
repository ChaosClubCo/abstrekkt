// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsAgent = await client.beta.agents.update('agent_011CZkYpogX7uDKUyvBTophP', {
  version: 1,
});

console.log(betaManagedAgentsAgent.id);
