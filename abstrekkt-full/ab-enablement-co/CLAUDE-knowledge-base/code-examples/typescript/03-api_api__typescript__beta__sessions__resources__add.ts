// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsFileResource = await client.beta.sessions.resources.add(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
  { file_id: 'file_011CNha8iCJcU1wXNR6q4V8w', type: 'file' },
);

console.log(betaManagedAgentsFileResource.id);
