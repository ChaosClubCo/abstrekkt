// --- block 0 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaModelInfo of client.beta.models.list()) {
  console.log(betaModelInfo.id);
}


// --- block 2 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaModelInfo = await client.beta.models.retrieve('model_id');

console.log(betaModelInfo.id);


// --- block 15 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaMessage = await client.beta.messages.create({
  max_tokens: 1024,
  messages: [{ content: 'Hello, world', role: 'user' }],
  model: 'claude-opus-4-6',
});

console.log(betaMessage.id);


// --- block 25 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaMessageTokensCount = await client.beta.messages.countTokens({
  messages: [{ content: 'Hello, world', role: 'user' }],
  model: 'claude-opus-4-6',
});

console.log(betaMessageTokensCount.context_management);


// --- block 44 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaMessageBatch = await client.beta.messages.batches.create({
  requests: [
    {
      custom_id: 'my-custom-id-1',
      params: {
        max_tokens: 1024,
        messages: [{ content: 'Hello, world', role: 'user' }],
        model: 'claude-opus-4-6',
      },
    },
  ],
});

console.log(betaMessageBatch.id);


// --- block 46 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaMessageBatch = await client.beta.messages.batches.retrieve('message_batch_id');

console.log(betaMessageBatch.id);


// --- block 48 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaMessageBatch of client.beta.messages.batches.list()) {
  console.log(betaMessageBatch.id);
}


// --- block 50 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaMessageBatch = await client.beta.messages.batches.cancel('message_batch_id');

console.log(betaMessageBatch.id);


// --- block 52 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaDeletedMessageBatch = await client.beta.messages.batches.delete('message_batch_id');

console.log(betaDeletedMessageBatch.id);


// --- block 57 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaMessageBatchIndividualResponse = await client.beta.messages.batches.results(
  'message_batch_id',
);

console.log(betaMessageBatchIndividualResponse.custom_id);


// --- block 67 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsAgent = await client.beta.agents.create({
  model: 'claude-sonnet-4-6',
  name: 'My First Agent',
});

console.log(betaManagedAgentsAgent.id);


// --- block 69 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsAgent of client.beta.agents.list()) {
  console.log(betaManagedAgentsAgent.id);
}


// --- block 71 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsAgent = await client.beta.agents.retrieve('agent_011CZkYpogX7uDKUyvBTophP');

console.log(betaManagedAgentsAgent.id);


// --- block 73 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsAgent = await client.beta.agents.update('agent_011CZkYpogX7uDKUyvBTophP', {
  version: 1,
});

console.log(betaManagedAgentsAgent.id);


// --- block 75 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsAgent = await client.beta.agents.archive('agent_011CZkYpogX7uDKUyvBTophP');

console.log(betaManagedAgentsAgent.id);


// --- block 77 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsAgent of client.beta.agents.versions.list(
  'agent_011CZkYpogX7uDKUyvBTophP',
)) {
  console.log(betaManagedAgentsAgent.id);
}


// --- block 79 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaEnvironment = await client.beta.environments.create({ name: 'python-data-analysis' });

console.log(betaEnvironment.id);


// --- block 81 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaEnvironment of client.beta.environments.list()) {
  console.log(betaEnvironment.id);
}


// --- block 83 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaEnvironment = await client.beta.environments.retrieve('env_011CZkZ9X2dpNyB7HsEFoRfW');

console.log(betaEnvironment.id);


// --- block 85 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaEnvironment = await client.beta.environments.update('env_011CZkZ9X2dpNyB7HsEFoRfW');

console.log(betaEnvironment.id);


// --- block 87 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaEnvironmentDeleteResponse = await client.beta.environments.delete(
  'env_011CZkZ9X2dpNyB7HsEFoRfW',
);

console.log(betaEnvironmentDeleteResponse.id);


// --- block 89 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaEnvironment = await client.beta.environments.archive('env_011CZkZ9X2dpNyB7HsEFoRfW');

console.log(betaEnvironment.id);


// --- block 91 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaSelfHostedWork = await client.beta.environments.work.retrieve('work_id', {
  environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
});

console.log(betaSelfHostedWork.id);


// --- block 93 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaSelfHostedWork = await client.beta.environments.work.poll('env_011CZkZ9X2dpNyB7HsEFoRfW');

console.log(betaSelfHostedWork.id);


// --- block 95 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaSelfHostedWork = await client.beta.environments.work.ack('work_id', {
  environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
});

console.log(betaSelfHostedWork.id);


// --- block 97 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaSelfHostedWorkHeartbeatResponse = await client.beta.environments.work.heartbeat(
  'work_id',
  { environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW' },
);

console.log(betaSelfHostedWorkHeartbeatResponse.last_heartbeat);


// --- block 99 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaSelfHostedWork = await client.beta.environments.work.stop('work_id', {
  environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
});

console.log(betaSelfHostedWork.id);


// --- block 101 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaSelfHostedWork of client.beta.environments.work.list(
  'env_011CZkZ9X2dpNyB7HsEFoRfW',
)) {
  console.log(betaSelfHostedWork.id);
}


// --- block 103 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaSelfHostedWork = await client.beta.environments.work.update('work_id', {
  environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
  metadata: { foo: 'string' },
});

console.log(betaSelfHostedWork.id);


// --- block 105 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaSelfHostedWorkQueueStats = await client.beta.environments.work.stats(
  'env_011CZkZ9X2dpNyB7HsEFoRfW',
);

console.log(betaSelfHostedWorkQueueStats.depth);


// --- block 107 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsSession = await client.beta.sessions.create({
  agent: 'agent_011CZkYpogX7uDKUyvBTophP',
  environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
});

console.log(betaManagedAgentsSession.id);


// --- block 109 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsSession of client.beta.sessions.list()) {
  console.log(betaManagedAgentsSession.id);
}


// --- block 111 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsSession = await client.beta.sessions.retrieve(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
);

console.log(betaManagedAgentsSession.id);


// --- block 113 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsSession = await client.beta.sessions.update('sesn_011CZkZAtmR3yMPDzynEDxu7');

console.log(betaManagedAgentsSession.id);


// --- block 115 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsDeletedSession = await client.beta.sessions.delete(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
);

console.log(betaManagedAgentsDeletedSession.id);


// --- block 117 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsSession = await client.beta.sessions.archive(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
);

console.log(betaManagedAgentsSession.id);


// --- block 119 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsSessionEvent of client.beta.sessions.events.list(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
)) {
  console.log(betaManagedAgentsSessionEvent);
}


// --- block 121 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsSendSessionEvents = await client.beta.sessions.events.send(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
  {
    events: [
      { content: [{ text: 'Where is my order #1234?', type: 'text' }], type: 'user.message' },
    ],
  },
);

console.log(betaManagedAgentsSendSessionEvents.data);


// --- block 123 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsStreamSessionEvents = await client.beta.sessions.events.stream(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
);

console.log(betaManagedAgentsStreamSessionEvents);


// --- block 125 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsFileResource = await client.beta.sessions.resources.add(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
  { file_id: 'file_011CNha8iCJcU1wXNR6q4V8w', type: 'file' },
);

console.log(betaManagedAgentsFileResource.id);


// --- block 127 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsSessionResource of client.beta.sessions.resources.list(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
)) {
  console.log(betaManagedAgentsSessionResource);
}


// --- block 129 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const resource = await client.beta.sessions.resources.retrieve('sesrsc_011CZkZBJq5dWxk9fVLNcPht', {
  session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7',
});

console.log(resource);


// --- block 131 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const resource = await client.beta.sessions.resources.update('sesrsc_011CZkZBJq5dWxk9fVLNcPht', {
  session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7',
  authorization_token: 'ghp_exampletoken',
});

console.log(resource);


// --- block 133 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsDeleteSessionResource = await client.beta.sessions.resources.delete(
  'sesrsc_011CZkZBJq5dWxk9fVLNcPht',
  { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
);

console.log(betaManagedAgentsDeleteSessionResource.id);


// --- block 135 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsSessionThread of client.beta.sessions.threads.list(
  'sesn_011CZkZAtmR3yMPDzynEDxu7',
)) {
  console.log(betaManagedAgentsSessionThread.id);
}


// --- block 137 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsSessionThread = await client.beta.sessions.threads.retrieve(
  'sthr_011CZkZVWa6oIjw0rgXZpnBt',
  { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
);

console.log(betaManagedAgentsSessionThread.id);


// --- block 139 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsSessionThread = await client.beta.sessions.threads.archive(
  'sthr_011CZkZVWa6oIjw0rgXZpnBt',
  { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
);

console.log(betaManagedAgentsSessionThread.id);


// --- block 141 (lang: typescript) ---
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


// --- block 143 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsStreamSessionThreadEvents = await client.beta.sessions.threads.events.stream(
  'sthr_011CZkZVWa6oIjw0rgXZpnBt',
  { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
);

console.log(betaManagedAgentsStreamSessionThreadEvents);


// --- block 145 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsVault = await client.beta.vaults.create({ display_name: 'Example vault' });

console.log(betaManagedAgentsVault.id);


// --- block 147 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsVault of client.beta.vaults.list()) {
  console.log(betaManagedAgentsVault.id);
}


// --- block 149 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsVault = await client.beta.vaults.retrieve('vlt_011CZkZDLs7fYzm1hXNPeRjv');

console.log(betaManagedAgentsVault.id);


// --- block 151 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsVault = await client.beta.vaults.update('vlt_011CZkZDLs7fYzm1hXNPeRjv');

console.log(betaManagedAgentsVault.id);


// --- block 153 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsDeletedVault = await client.beta.vaults.delete(
  'vlt_011CZkZDLs7fYzm1hXNPeRjv',
);

console.log(betaManagedAgentsDeletedVault.id);


// --- block 155 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsVault = await client.beta.vaults.archive('vlt_011CZkZDLs7fYzm1hXNPeRjv');

console.log(betaManagedAgentsVault.id);


// --- block 157 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsCredential = await client.beta.vaults.credentials.create(
  'vlt_011CZkZDLs7fYzm1hXNPeRjv',
  {
    auth: {
      token: 'bearer_exampletoken',
      mcp_server_url: 'https://example-server.modelcontextprotocol.io/sse',
      type: 'static_bearer',
    },
  },
);

console.log(betaManagedAgentsCredential.id);


// --- block 159 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsCredential of client.beta.vaults.credentials.list(
  'vlt_011CZkZDLs7fYzm1hXNPeRjv',
)) {
  console.log(betaManagedAgentsCredential.id);
}


// --- block 161 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsCredential = await client.beta.vaults.credentials.retrieve(
  'vcrd_011CZkZEMt8gZan2iYOQfSkw',
  { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
);

console.log(betaManagedAgentsCredential.id);


// --- block 163 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsCredential = await client.beta.vaults.credentials.update(
  'vcrd_011CZkZEMt8gZan2iYOQfSkw',
  { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
);

console.log(betaManagedAgentsCredential.id);


// --- block 165 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsDeletedCredential = await client.beta.vaults.credentials.delete(
  'vcrd_011CZkZEMt8gZan2iYOQfSkw',
  { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
);

console.log(betaManagedAgentsDeletedCredential.id);


// --- block 167 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsCredential = await client.beta.vaults.credentials.archive(
  'vcrd_011CZkZEMt8gZan2iYOQfSkw',
  { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
);

console.log(betaManagedAgentsCredential.id);


// --- block 169 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsCredentialValidation = await client.beta.vaults.credentials.mcpOAuthValidate(
  'vcrd_011CZkZEMt8gZan2iYOQfSkw',
  { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
);

console.log(betaManagedAgentsCredentialValidation.credential_id);


// --- block 171 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsMemoryStore = await client.beta.memoryStores.create({ name: 'x' });

console.log(betaManagedAgentsMemoryStore.id);


// --- block 173 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsMemoryStore of client.beta.memoryStores.list()) {
  console.log(betaManagedAgentsMemoryStore.id);
}


// --- block 175 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsMemoryStore = await client.beta.memoryStores.retrieve('memory_store_id');

console.log(betaManagedAgentsMemoryStore.id);


// --- block 177 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsMemoryStore = await client.beta.memoryStores.update('memory_store_id');

console.log(betaManagedAgentsMemoryStore.id);


// --- block 179 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsDeletedMemoryStore = await client.beta.memoryStores.delete(
  'memory_store_id',
);

console.log(betaManagedAgentsDeletedMemoryStore.id);


// --- block 181 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsMemoryStore = await client.beta.memoryStores.archive('memory_store_id');

console.log(betaManagedAgentsMemoryStore.id);


// --- block 183 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsMemory = await client.beta.memoryStores.memories.create('memory_store_id', {
  content: 'content',
  path: 'xx',
});

console.log(betaManagedAgentsMemory.id);


// --- block 185 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsMemoryListItem of client.beta.memoryStores.memories.list(
  'memory_store_id',
)) {
  console.log(betaManagedAgentsMemoryListItem);
}


// --- block 187 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsMemory = await client.beta.memoryStores.memories.retrieve('memory_id', {
  memory_store_id: 'memory_store_id',
});

console.log(betaManagedAgentsMemory.id);


// --- block 189 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsMemory = await client.beta.memoryStores.memories.update('memory_id', {
  memory_store_id: 'memory_store_id',
});

console.log(betaManagedAgentsMemory.id);


// --- block 191 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsDeletedMemory = await client.beta.memoryStores.memories.delete('memory_id', {
  memory_store_id: 'memory_store_id',
});

console.log(betaManagedAgentsDeletedMemory.id);


// --- block 193 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaManagedAgentsMemoryVersion of client.beta.memoryStores.memoryVersions.list(
  'memory_store_id',
)) {
  console.log(betaManagedAgentsMemoryVersion.id);
}


// --- block 195 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsMemoryVersion = await client.beta.memoryStores.memoryVersions.retrieve(
  'memory_version_id',
  { memory_store_id: 'memory_store_id' },
);

console.log(betaManagedAgentsMemoryVersion.id);


// --- block 197 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaManagedAgentsMemoryVersion = await client.beta.memoryStores.memoryVersions.redact(
  'memory_version_id',
  { memory_store_id: 'memory_store_id' },
);

console.log(betaManagedAgentsMemoryVersion.id);


// --- block 199 (lang: typescript) ---
import fs from 'fs';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const fileMetadata = await client.beta.files.upload({ file: fs.createReadStream('path/to/file') });

console.log(fileMetadata.id);


// --- block 201 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const fileMetadata of client.beta.files.list()) {
  console.log(fileMetadata.id);
}


// --- block 203 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const response = await client.beta.files.download('file_id');

console.log(response);

const content = await response.blob();
console.log(content);


// --- block 204 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const fileMetadata = await client.beta.files.retrieveMetadata('file_id');

console.log(fileMetadata.id);


// --- block 206 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const deletedFile = await client.beta.files.delete('file_id');

console.log(deletedFile.id);


// --- block 208 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const skill = await client.beta.skills.create();

console.log(skill.id);


// --- block 210 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const skillListResponse of client.beta.skills.list()) {
  console.log(skillListResponse.id);
}


// --- block 212 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const skill = await client.beta.skills.retrieve('skill_id');

console.log(skill.id);


// --- block 214 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const skill = await client.beta.skills.delete('skill_id');

console.log(skill.id);


// --- block 216 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const version = await client.beta.skills.versions.create('skill_id');

console.log(version.id);


// --- block 218 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const versionListResponse of client.beta.skills.versions.list('skill_id')) {
  console.log(versionListResponse.id);
}


// --- block 220 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const response = await client.beta.skills.versions.download('version', { skill_id: 'skill_id' });

console.log(response);

const content = await response.blob();
console.log(content);


// --- block 221 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const version = await client.beta.skills.versions.retrieve('version', { skill_id: 'skill_id' });

console.log(version.id);


// --- block 223 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const version = await client.beta.skills.versions.delete('version', { skill_id: 'skill_id' });

console.log(version.id);


// --- block 225 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaUserProfile = await client.beta.userProfiles.create();

console.log(betaUserProfile.id);


// --- block 227 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

// Automatically fetches more pages as needed.
for await (const betaUserProfile of client.beta.userProfiles.list()) {
  console.log(betaUserProfile.id);
}


// --- block 229 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaUserProfile = await client.beta.userProfiles.retrieve('uprof_011CZkZCu8hGbp5mYRQgUmz9');

console.log(betaUserProfile.id);


// --- block 231 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaUserProfile = await client.beta.userProfiles.update('uprof_011CZkZCu8hGbp5mYRQgUmz9');

console.log(betaUserProfile.id);


// --- block 233 (lang: typescript) ---
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

const betaUserProfileEnrollmentURL = await client.beta.userProfiles.createEnrollmentURL(
  'uprof_011CZkZCu8hGbp5mYRQgUmz9',
);

console.log(betaUserProfileEnrollmentURL.expires_at);
