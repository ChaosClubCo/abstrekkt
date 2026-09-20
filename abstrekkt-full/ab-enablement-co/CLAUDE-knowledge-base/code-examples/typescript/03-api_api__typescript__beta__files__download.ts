// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const response = await client.beta.files.download('file_id');

console.log(response);

const content = await response.blob();
console.log(content);
