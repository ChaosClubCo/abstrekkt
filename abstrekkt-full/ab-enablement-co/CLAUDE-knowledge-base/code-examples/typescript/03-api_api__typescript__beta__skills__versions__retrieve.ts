// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const version = await client.beta.skills.versions.retrieve('version', { skill_id: 'skill_id' });

console.log(version.id);
