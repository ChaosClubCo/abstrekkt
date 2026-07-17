// --- block 3 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const messageBatchIndividualResponse = await client.messages.batches.results('message_batch_id');

console.log(messageBatchIndividualResponse.custom_id);
