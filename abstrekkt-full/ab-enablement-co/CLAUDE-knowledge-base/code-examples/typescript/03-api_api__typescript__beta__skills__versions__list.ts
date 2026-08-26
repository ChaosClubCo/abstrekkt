// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const versionListResponse of client.beta.skills.versions.list('skill_id')) {
  console.log(versionListResponse.id);
}
