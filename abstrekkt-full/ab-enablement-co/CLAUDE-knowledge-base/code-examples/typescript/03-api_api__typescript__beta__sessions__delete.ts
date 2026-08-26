// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsDeletedSession = await client.beta.sessions.delete(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
);

console.log(betaManagedAgentsDeletedSession.id);
