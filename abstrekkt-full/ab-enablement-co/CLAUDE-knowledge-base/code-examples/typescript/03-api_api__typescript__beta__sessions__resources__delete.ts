// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsDeleteSessionResource = await client.beta.sessions.resources.delete(
  'sesrsc_011CZkZBJq5dWxk9fVLNcPht',
  { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
);

console.log(betaManagedAgentsDeleteSessionResource.id);
