// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsMemoryVersion = await client.beta.memoryStores.memoryVersions.retrieve(
  'memory_version_id',
  { memory_store_id: 'memory_store_id' },
);

console.log(betaManagedAgentsMemoryVersion.id);
