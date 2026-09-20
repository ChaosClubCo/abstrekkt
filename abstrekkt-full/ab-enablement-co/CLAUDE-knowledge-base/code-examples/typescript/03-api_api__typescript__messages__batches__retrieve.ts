// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const messageBatch = await client.messages.batches.retrieve('message_batch_id');

console.log(messageBatch.id);
