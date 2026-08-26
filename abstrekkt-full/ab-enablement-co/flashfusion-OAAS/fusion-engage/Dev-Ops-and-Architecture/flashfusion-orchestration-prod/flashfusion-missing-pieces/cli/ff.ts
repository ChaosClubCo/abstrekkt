#!/usr/bin/env tsx
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';

const argv = yargs(hideBin(process.argv))
  .command('generate <type>', 'Generate resources', (y) =>
    y.positional('type', { choices: ['lesson','flashcards'] as const })
     .option('topic', { type: 'string', demandOption: true })
     .option('level', { type: 'string' })
  ).help().argv as any;

(async () => {
  const base = process.env.API_BASE || `http://localhost:${process.env.PORT||5173}`;
  if (argv._[0] === 'generate' && argv.type === 'lesson') {
    const r = await fetch(`${base}/api/generate/lesson`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ topic: argv.topic, level: argv.level||'General' })});
    console.log(await r.json());
  } else if (argv._[0] === 'generate' && argv.type === 'flashcards') {
    const r = await fetch(`${base}/api/generate/flashcards`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ topic: argv.topic, level: argv.level||'General' })});
    console.log(await r.json());
  }
})();
