// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsDeletedVault = await client.beta.vaults.delete(
  'vlt_011CZkZDLs7fYzm1hXNPeRjv',
);

console.log(betaManagedAgentsDeletedVault.id);
