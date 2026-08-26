// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsSession = await client.beta.sessions.retrieve(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
);

console.log(betaManagedAgentsSession.id);
