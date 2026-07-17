// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsSessionEvent of client.beta.sessions.threads.events.list(
  'sthr_011CZkZVWa6oIjw0rgXZpnBt',
  { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
)) {
  console.log(betaManagedAgentsSessionEvent);
}
