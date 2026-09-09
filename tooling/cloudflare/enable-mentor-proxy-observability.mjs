import { writeFileSync } from 'node:fs';
import {
  getScriptLevelSettings,
  getScriptSettings,
  patchScriptLevelSettings,
} from './telemetry.mjs';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const workerName = required('WORKER_NAME');
const prePath = required('OBSERVABILITY_PRE_SETTINGS_PATH');
const postPath = required('OBSERVABILITY_POST_SETTINGS_PATH');

const scriptLevelBefore = await getScriptLevelSettings(workerName);
const versionSettingsBefore = await getScriptSettings(workerName);
const currentObservability = scriptLevelBefore?.observability || versionSettingsBefore?.observability;
if (!currentObservability) throw new Error('Cloudflare returned no observability settings for Worker');

writeFileSync(
  prePath,
  `${JSON.stringify({ script_level: scriptLevelBefore, version_settings: versionSettingsBefore }, null, 2)}\n`,
);

const desiredObservability = {
  ...currentObservability,
  enabled: true,
  traces: {
    ...(currentObservability.traces || {}),
    enabled: true,
    persist: true,
    head_sampling_rate: 1,
  },
};

await patchScriptLevelSettings(workerName, { observability: desiredObservability });

const scriptLevelAfter = await getScriptLevelSettings(workerName);
const versionSettingsAfter = await getScriptSettings(workerName);
const observed = scriptLevelAfter?.observability || versionSettingsAfter?.observability;

writeFileSync(
  postPath,
  `${JSON.stringify({ script_level: scriptLevelAfter, version_settings: versionSettingsAfter }, null, 2)}\n`,
);

if (observed?.enabled !== true) throw new Error('Cloudflare observability.enabled did not read back true');
if (observed?.traces?.enabled !== true) throw new Error('Cloudflare traces.enabled did not read back true');
if (observed?.traces?.persist !== true) throw new Error('Cloudflare traces.persist did not read back true');
if (Number(observed?.traces?.head_sampling_rate) !== 1) {
  throw new Error('Cloudflare trace head_sampling_rate did not read back 1');
}

console.log('OBSERVABILITY_ENABLED=true');
console.log('TRACES_ENABLED=true');
console.log('TRACES_PERSIST=true');
console.log('TRACE_HEAD_SAMPLING_RATE=1');
