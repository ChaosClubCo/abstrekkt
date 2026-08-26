'use strict';
// Generator for n8n_ai_brain_workflow.json ("AI Brain — Agent Pipeline v2").
// Code nodes are authored as real functions and captured via Function.prototype.toString
// so regexes / template literals survive without hand-escaping. Every embedded snippet is
// syntax-checked before the file is written. Run: node build_workflow.js
const fs = require('fs');

const OUT = 'D:/02_Homebase/02_abstrekkt/KAR/02_Projects/Freelance/03-abstrekkt/Abstrekkt-os/Abstrekkt-brand/ai-brain-arch/n8n_ai_brain_workflow.json';

// ---- helpers -------------------------------------------------------------
function body(fn) {
  const src = fn.toString();
  return src.slice(src.indexOf('{') + 1, src.lastIndexOf('}')).replace(/^\n/, '').replace(/\n\s*$/, '');
}
const L = s => JSON.stringify(s);
const R = ref => ' + ' + ref + ' + ';

// ---- Claude output schemas (structured outputs) --------------------------
const SPEC_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['spec_file', 'schema_version', 'task_name', 'steps', 'risks', 'acceptance_criteria', 'estimated_complexity', 'timestamp'],
  properties: {
    spec_file: { type: 'string' }, schema_version: { type: 'string', const: '1.0' }, task_name: { type: 'string' },
    steps: { type: 'array', items: { type: 'string' } }, risks: { type: 'array', items: { type: 'string' } },
    acceptance_criteria: { type: 'array', items: { type: 'string' } },
    estimated_complexity: { type: 'string', enum: ['low', 'medium', 'high'] }, timestamp: { type: 'string' }
  }
};
const PLAN_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['result_file', 'schema_version', 'task_name', 'plan_steps', 'files_touched', 'rollback', 'timestamp'],
  properties: {
    result_file: { type: 'string' }, schema_version: { type: 'string', const: '1.0' }, task_name: { type: 'string' },
    plan_steps: { type: 'array', items: { type: 'string' } }, files_touched: { type: 'array', items: { type: 'string' } },
    rollback: { type: 'array', items: { type: 'string' } }, timestamp: { type: 'string' }
  }
};
const REPORT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['status', 'result_file', 'reasons', 'schema_version', 'timestamp'],
  properties: {
    status: { type: 'string', enum: ['VALIDATED', 'REJECTED'] }, result_file: { type: 'string' },
    reasons: { type: 'array', items: { type: 'string' } }, schema_version: { type: 'string', const: '1.0' }, timestamp: { type: 'string' }
  }
};
const AUDIT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['summary', 'risk_level', 'schema_version', 'timestamp'],
  properties: {
    summary: { type: 'string' }, risk_level: { type: 'string', enum: ['low', 'medium', 'high'] },
    schema_version: { type: 'string', const: '1.0' }, timestamp: { type: 'string' }
  }
};

// ---- Claude request body (structured outputs, thinking disabled) ---------
function agentBody(maxTokens, system, schema, promptExpr) {
  return "={{ JSON.stringify({ model: 'claude-sonnet-5', max_tokens: " + maxTokens +
    ", thinking: { type: 'disabled' }, system: " + JSON.stringify(system) +
    ", output_config: { format: { type: 'json_schema', schema: " + JSON.stringify(schema) + " } }" +
    ", messages: [ { role: 'user', content: " + promptExpr + " } ] }) }}";
}
const prompt1 = L('Analyze this task note and generate a SPEC.\n\nFile: ') + R('$json.file_path') +
  L('\nCommit: ') + R('$json.commit_hash') + L('\n\nContent:\n') + R('$json.file_content') +
  L('\n\nSet spec_file to OUTPUT/pending-review/SPEC_<task-name>.md and timestamp to the current ISO8601 time.');
const prompt2 = L('Generate a concrete implementation plan from this APPROVED spec.\n\nFile: ') + R('$json.file_path') +
  L('\nCommit: ') + R('$json.commit_hash') + L('\n\nContent:\n') + R('$json.file_content') +
  L('\n\nSet result_file to RESULTS/PLAN_<task-name>.md, include a rollback plan, and timestamp as ISO8601.');
const prompt3 = L('Validate this implementation result against its spec and decide VALIDATED or REJECTED.\n\nFile: ') + R('$json.file_path') +
  L('\nCommit: ') + R('$json.commit_hash') + L('\n\nContent:\n') + R('$json.file_content') +
  L('\n\nSet result_file to the file under review, give at least one reason, and timestamp as ISO8601.');
const prompt4 = L('Summarize this result and its validation for the audit trail.\n\nResult file: ') +
  R("$('Filter Result Files').first().json.file_path") + L('\nValidation status: ') + R("$('Gate 2 — Validate Report').first().json.status") +
  L('\nCommit: ') + R("$('Filter Result Files').first().json.commit_hash") +
  L('\n\nProvide a concise summary, a risk_level, and timestamp as ISO8601.');

// ---- Supabase audit bodies ----------------------------------------------
const auditTask = "={{ JSON.stringify({ agent_name: 'task-analyzer', task_file: $('Filter Task Files').first().json.file_path, output_file: $json.spec_file, commit_hash: $('Filter Task Files').first().json.commit_hash, status: 'pending', token_count: $('Agent 1 · Task Analyzer').first().json.usage?.output_tokens || 0 }) }}";
const auditSpec = "={{ JSON.stringify({ agent_name: 'spec-generator', task_file: $('Filter Approved Files').first().json.file_path, output_file: $json.result_file, commit_hash: $('Filter Approved Files').first().json.commit_hash, status: 'approved', token_count: $('Agent 2 · Spec Generator').first().json.usage?.output_tokens || 0 }) }}";
const auditValidator = "={{ JSON.stringify({ agent_name: 'validator', task_file: $('Filter Result Files').first().json.file_path, output_file: $json.result_file, commit_hash: $('Filter Result Files').first().json.commit_hash, status: ($json.status === 'VALIDATED' ? 'approved' : 'rejected'), token_count: $('Agent 3 · Validator').first().json.usage?.output_tokens || 0 }) }}";
const auditAuditor = "={{ JSON.stringify({ agent_name: 'auditor', task_file: $('Filter Result Files').first().json.file_path, commit_hash: $('Filter Result Files').first().json.commit_hash, status: 'approved', token_count: $('Agent 4 · Auditor').first().json.usage?.output_tokens || 0 }) }}";

// ---- Code node bodies (authored as real functions) ----------------------
function sanitize() {
  // Gate 1: block prompt-injection patterns before any content reaches an agent.
  const item = $input.first().json;
  const BLOCKED_PATTERNS = [
    /eval\s*\(/gi,
    /exec\s*\(/gi,
    /\.\.\//g,
    /<script/gi,
    /DROP\s+TABLE/gi,
    /DELETE\s+FROM/gi,
    /system\s*\(/gi
  ];
  const content = item.file_content || '';
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      throw new Error('GATE1_BLOCKED: Injection pattern detected in ' + item.file_path + ': ' + pattern);
    }
  }
  return [{ json: Object.assign({}, item, { sanitized: true, gate1_passed: true, gate1_timestamp: new Date().toISOString() }) }];
}

// Single-writer: process one changed file per push. Filters exclude EXCLUDE and non-.md.
// file_content is populated downstream by the Obsidian read node.
function makeFilter(prefix, exclude) {
  const fn = function () {
    const payload = $input.first().json;
    const commits = payload.commits || [];
    const files = [].concat.apply([], commits.map(c => c.added || []))
      .concat([].concat.apply([], commits.map(c => c.modified || [])));
    const matched = files.filter(f => f.indexOf(PREFIX) === 0 && f.endsWith('.md') && f.indexOf(EXCLUDE) !== 0);
    if (matched.length === 0) { return []; }
    const filePath = matched[0];
    return [{ json: {
      file_path: filePath,
      file_content: '',
      commit_hash: payload.after || 'unknown',
      repo: (payload.repository && payload.repository.full_name) || 'unknown',
      pushed_at: new Date().toISOString()
    } }];
  }.toString().replace('PREFIX', JSON.stringify(prefix)).replace('EXCLUDE', JSON.stringify(exclude || ' '));
  return fn.slice(fn.indexOf('{') + 1, fn.lastIndexOf('}')).replace(/^\n/, '').replace(/\n\s*$/, '');
}

// Merge the Obsidian read response back onto the filter item (position-independent via node ref).
function makeMerge(filterName) {
  const fn = function () {
    const original = $(FILTER).first().json;
    const resp = $input.first().json;
    const c = (typeof resp === 'string') ? resp
      : (resp && resp.data != null ? resp.data
        : (resp && resp.body != null ? resp.body
          : (resp && resp.content != null ? resp.content : '')));
    return [{ json: Object.assign({}, original, { file_content: String(c || '') }) }];
  }.toString().replace('FILTER', JSON.stringify(filterName));
  return fn.slice(fn.indexOf('{') + 1, fn.lastIndexOf('}')).replace(/^\n/, '').replace(/\n\s*$/, '');
}

function gate2Spec() {
  // Structured outputs guarantee JSON shape + enums. This gate enforces what a schema can't:
  // non-empty arrays + the write-path boundary (defense in depth).
  const response = $input.first().json;
  const raw = response.content && response.content[0] ? response.content[0].text : '';
  let parsed;
  try { parsed = JSON.parse(raw); }
  catch (e) { throw new Error('GATE2_INVALID_JSON: ' + String(raw).substring(0, 200)); }
  if (!parsed.spec_file || parsed.spec_file.indexOf('OUTPUT/pending-review/') !== 0) {
    throw new Error('GATE2_PATH_VIOLATION: spec_file must be under OUTPUT/pending-review/');
  }
  if (!Array.isArray(parsed.steps) || parsed.steps.length < 1) {
    throw new Error('GATE2_MISSING_STEPS: at least one step required');
  }
  if (!Array.isArray(parsed.acceptance_criteria) || parsed.acceptance_criteria.length < 1) {
    throw new Error('GATE2_MISSING_CRITERIA: acceptance_criteria required');
  }
  return [{ json: Object.assign({}, parsed, { gate2_passed: true, gate2_timestamp: new Date().toISOString() }) }];
}
function gate2Plan() {
  const response = $input.first().json;
  const raw = response.content && response.content[0] ? response.content[0].text : '';
  let parsed;
  try { parsed = JSON.parse(raw); }
  catch (e) { throw new Error('GATE2_INVALID_JSON: ' + String(raw).substring(0, 200)); }
  if (!parsed.result_file || parsed.result_file.indexOf('RESULTS/') !== 0) {
    throw new Error('GATE2_PATH_VIOLATION: result_file must be under RESULTS/');
  }
  if (!Array.isArray(parsed.plan_steps) || parsed.plan_steps.length < 1) {
    throw new Error('GATE2_MISSING_STEPS: at least one plan step required');
  }
  if (!Array.isArray(parsed.rollback) || parsed.rollback.length < 1) {
    throw new Error('GATE2_MISSING_ROLLBACK: a rollback plan is required');
  }
  return [{ json: Object.assign({}, parsed, { gate2_passed: true, gate2_timestamp: new Date().toISOString() }) }];
}
function gate2Report() {
  const response = $input.first().json;
  const raw = response.content && response.content[0] ? response.content[0].text : '';
  let parsed;
  try { parsed = JSON.parse(raw); }
  catch (e) { throw new Error('GATE2_INVALID_JSON: ' + String(raw).substring(0, 200)); }
  if (!parsed.result_file || parsed.result_file.indexOf('RESULTS/') !== 0) {
    throw new Error('GATE2_PATH_VIOLATION: result_file must be under RESULTS/');
  }
  if (!Array.isArray(parsed.reasons) || parsed.reasons.length < 1) {
    throw new Error('GATE2_MISSING_REASONS: at least one reason required');
  }
  return [{ json: Object.assign({}, parsed, { gate2_passed: true, gate2_timestamp: new Date().toISOString() }) }];
}

function parseAudit() {
  const response = $input.first().json;
  const raw = response.content && response.content[0] ? response.content[0].text : '{}';
  const parsed = JSON.parse(raw);
  return [{ json: Object.assign({}, parsed, { parsed: true, parsed_timestamp: new Date().toISOString() }) }];
}

function fmtSpec() {
  const spec = $('Gate 2 — Validate Spec').first().json;
  const content = `---
title: ${spec.task_name}
type: spec
status: pending-review
agent: task-analyzer
created: ${spec.timestamp}
complexity: ${spec.estimated_complexity}
schema_version: ${spec.schema_version}
---

# SPEC: ${spec.task_name}

## Steps
${spec.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Risks
${spec.risks.map(r => `- ${r}`).join('\n') || '- None identified'}

## Acceptance Criteria
${spec.acceptance_criteria.map(c => `- [ ] ${c}`).join('\n')}

---
*Generated by Task Analyzer agent. Move to /OUTPUT/approved/ to proceed.*
`;
  return [{ json: Object.assign({}, spec, { markdown_content: content, write_path: spec.spec_file }) }];
}
function fmtPlan() {
  const plan = $('Gate 2 — Validate Plan').first().json;
  const content = `---
title: ${plan.task_name}
type: plan
status: generated
agent: spec-generator
created: ${plan.timestamp}
schema_version: ${plan.schema_version}
---

# PLAN: ${plan.task_name}

## Implementation Steps
${plan.plan_steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Files Touched
${plan.files_touched.map(f => `- ${f}`).join('\n') || '- None specified'}

## Rollback
${plan.rollback.map(r => `- ${r}`).join('\n')}

---
*Generated by Spec Generator agent. Written to /RESULTS/ (triggers the Validator).*
`;
  return [{ json: Object.assign({}, plan, { markdown_content: content, write_path: plan.result_file }) }];
}
function fmtValidation() {
  const report = $('Gate 2 — Validate Report').first().json;
  // Write to RESULTS/reports/ so the report does NOT re-trigger the RESULTS/ filter (loop guard).
  const base = String(report.result_file || 'RESULTS/unknown.md').split('/').pop().replace(/\.md$/, '');
  const outPath = 'RESULTS/reports/' + base + '.validation.md';
  const content = `---
title: Validation Report
type: validation
status: ${report.status}
agent: validator
created: ${report.timestamp}
schema_version: ${report.schema_version}
result_file: ${report.result_file}
---

# VALIDATION: ${report.status}

## Reasons
${report.reasons.map(r => `- ${r}`).join('\n')}

---
*Generated by Validator agent.*
`;
  return [{ json: Object.assign({}, report, { markdown_content: content, write_path: outPath }) }];
}

function errorHandler() {
  const error = $input.first().json;
  const errorMsg = error.message || (error.error && error.error.message) || 'Unknown error';
  const failedNode = error.node || 'unknown';
  console.error('[AI Brain Error] Node: ' + failedNode + ' | Error: ' + errorMsg);
  return [{ json: { agent_name: 'pipeline', status: 'error', error_msg: errorMsg, failed_node: failedNode, timestamp: new Date().toISOString() } }];
}

// ---- node factories ------------------------------------------------------
function codeNode(id, name, pos, jsCode, notes) {
  return { parameters: { jsCode }, id, name, type: 'n8n-nodes-base.code', typeVersion: 2, position: pos, notes };
}
function agentNode(id, name, pos, bodyVal, notes) {
  return {
    parameters: {
      url: 'https://api.anthropic.com/v1/messages', sendHeaders: true,
      headerParameters: { parameters: [
        { name: 'x-api-key', value: '={{ $env.ANTHROPIC_API_KEY }}' },
        { name: 'anthropic-version', value: '2023-06-01' },
        { name: 'content-type', value: 'application/json' }
      ] },
      sendBody: true, bodyParameters: { parameters: [ { name: '=', value: bodyVal } ] },
      options: { timeout: 60000, response: { response: { responseFormat: 'json' } } }
    },
    id, name, type: 'n8n-nodes-base.httpRequest', typeVersion: 4, position: pos, notes
  };
}
function auditNode(id, name, pos, bodyVal, notes) {
  return {
    parameters: {
      url: '={{ $env.SUPABASE_URL }}/rest/v1/ai_brain_audit_trail', sendHeaders: true,
      headerParameters: { parameters: [
        { name: 'apikey', value: '={{ $env.SUPABASE_SERVICE_ROLE_KEY }}' },
        { name: 'Authorization', value: '=Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}' },
        { name: 'Content-Type', value: 'application/json' },
        { name: 'Prefer', value: 'return=representation' }
      ] },
      sendBody: true, bodyParameters: { parameters: [ { name: '=', value: bodyVal } ] }, options: {}
    },
    id, name, type: 'n8n-nodes-base.httpRequest', typeVersion: 4, position: pos, notes
  };
}
// Obsidian Local REST API GET /vault/{path} -> raw markdown (the concrete "MCP bridge" transport).
function readNode(id, name, pos, notes) {
  return {
    parameters: {
      url: '={{ $env.OBSIDIAN_API_URL }}/vault/{{ $json.file_path.split(\'/\').map(encodeURIComponent).join(\'/\') }}',
      sendHeaders: true,
      headerParameters: { parameters: [
        { name: 'Authorization', value: '=Bearer {{ $env.OBSIDIAN_API_KEY }}' },
        { name: 'Accept', value: 'text/markdown' }
      ] },
      options: { timeout: 30000, response: { response: { responseFormat: 'text' } } }
    },
    id, name, type: 'n8n-nodes-base.httpRequest', typeVersion: 4, position: pos, notes
  };
}
// Obsidian Local REST API PUT /vault/{path} <- markdown_content.
function writeNode(id, name, pos, notes) {
  return {
    parameters: {
      method: 'PUT',
      url: '={{ $env.OBSIDIAN_API_URL }}/vault/{{ $json.write_path.split(\'/\').map(encodeURIComponent).join(\'/\') }}',
      sendHeaders: true,
      headerParameters: { parameters: [ { name: 'Authorization', value: '=Bearer {{ $env.OBSIDIAN_API_KEY }}' } ] },
      sendBody: true, contentType: 'raw', rawContentType: 'text/markdown',
      body: '={{ $json.markdown_content }}', options: { timeout: 30000 }
    },
    id, name, type: 'n8n-nodes-base.httpRequest', typeVersion: 4, position: pos, notes
  };
}

const A1 = 'Agent 1 · Task Analyzer', A2 = 'Agent 2 · Spec Generator', A3 = 'Agent 3 · Validator', A4 = 'Agent 4 · Auditor';
const slug = s => s.replace(/[^a-z0-9]+/gi, '-').toLowerCase();

const nodes = [
  { parameters: { httpMethod: 'POST', path: 'ai-brain-task-trigger', responseMode: 'onReceived', options: {} },
    id: 'github-webhook', name: 'GitHub Webhook', type: 'n8n-nodes-base.webhook', typeVersion: 1,
    position: [240, 460], webhookId: 'ai-brain-task-trigger',
    notes: 'One webhook fans out to three folder filters (TASKS/, OUTPUT/approved/, RESULTS/). Single file per push (single-writer). Obsidian Sync -> GitHub push chains the transitions.' },

  // Task lane (Agent 1)
  codeNode('filter-task', 'Filter Task Files', [440, 160], makeFilter('TASKS/'), 'Keeps the first TASKS/*.md file. Halts if none.'),
  readNode('read-task', 'Read Task File', [640, 160], 'Obsidian GET -> raw markdown of the task note.'),
  codeNode('merge-task', 'Merge Task Content', [840, 160], makeMerge('Filter Task Files'), 'Merges read markdown into file_content.'),
  codeNode('gate1-task', 'Gate 1 — Sanitize (Task)', [1040, 160], body(sanitize), 'Gate 1: blocks injection patterns in the task note.'),
  agentNode(slug(A1), A1, [1240, 160], agentBody(5000, 'You are a Task Analyzer agent. Analyze the provided task note and produce a structured specification. Write output ONLY to OUTPUT/pending-review/. Token budget: 5000.', SPEC_SCHEMA, prompt1), 'Agent 1. Structured outputs; thinking disabled to protect the 5000-token budget.'),
  codeNode('gate2-spec', 'Gate 2 — Validate Spec', [1440, 160], body(gate2Spec), 'Gate 2: pending-review path boundary + non-empty steps/criteria.'),
  auditNode('audit-task', 'Write Audit — Task Analyzer', [1640, 160], auditTask, 'Supabase audit: agent=task-analyzer, status=pending.'),
  codeNode('format-spec', 'Format SPEC Markdown', [1840, 160], body(fmtSpec), 'Renders SPEC.md (reads the Gate node by name, not position).'),
  writeNode('write-spec', 'Write SPEC (Obsidian)', [2040, 160], 'Obsidian PUT -> OUTPUT/pending-review/SPEC_*.md. Human moves to approved/ to advance.'),

  // Approved lane (Agent 2)
  codeNode('filter-approved', 'Filter Approved Files', [440, 460], makeFilter('OUTPUT/approved/'), 'Keeps the first OUTPUT/approved/*.md file. Halts if none.'),
  readNode('read-approved', 'Read Approved File', [640, 460], 'Obsidian GET -> raw markdown of the approved spec.'),
  codeNode('merge-approved', 'Merge Approved Content', [840, 460], makeMerge('Filter Approved Files'), 'Merges read markdown into file_content.'),
  codeNode('gate1-approved', 'Gate 1 — Sanitize (Approved)', [1040, 460], body(sanitize), 'Gate 1: blocks injection patterns in the approved spec.'),
  agentNode(slug(A2), A2, [1240, 460], agentBody(8000, 'You are a Spec Generator agent. Given an APPROVED spec, produce a concrete implementation plan with an explicit rollback. Write output ONLY to RESULTS/. Token budget: 8000.', PLAN_SCHEMA, prompt2), 'Agent 2. Structured outputs. Triggered by a file moved to OUTPUT/approved/.'),
  codeNode('gate2-plan', 'Gate 2 — Validate Plan', [1440, 460], body(gate2Plan), 'Gate 2: RESULTS/ path boundary + non-empty plan steps + rollback required.'),
  auditNode('audit-spec', 'Write Audit — Spec Generator', [1640, 460], auditSpec, 'Supabase audit: agent=spec-generator, status=approved.'),
  codeNode('format-plan', 'Format Plan Markdown', [1840, 460], body(fmtPlan), 'Renders PLAN.md for RESULTS/.'),
  writeNode('write-plan', 'Write PLAN (Obsidian)', [2040, 460], 'Obsidian PUT -> RESULTS/PLAN_*.md. This write triggers the Validator lane.'),

  // Result lane (Agents 3 + 4)
  codeNode('filter-result', 'Filter Result Files', [440, 760], makeFilter('RESULTS/', 'RESULTS/reports/'), 'Keeps the first RESULTS/*.md file, EXCLUDING RESULTS/reports/ (loop guard).'),
  readNode('read-result', 'Read Result File', [640, 760], 'Obsidian GET -> raw markdown of the result/plan under review.'),
  codeNode('merge-result', 'Merge Result Content', [840, 760], makeMerge('Filter Result Files'), 'Merges read markdown into file_content.'),
  codeNode('gate1-result', 'Gate 1 — Sanitize (Result)', [1040, 760], body(sanitize), 'Gate 1: blocks injection patterns in the result file.'),
  agentNode(slug(A3), A3, [1240, 760], agentBody(3000, 'You are a Validator agent. Compare an implementation result against its spec and decide VALIDATED or REJECTED with reasons. Token budget: 3000.', REPORT_SCHEMA, prompt3), 'Agent 3. Structured outputs. Triggered by a new file in RESULTS/.'),
  codeNode('gate2-report', 'Gate 2 — Validate Report', [1440, 760], body(gate2Report), 'Gate 2: RESULTS/ path boundary + at least one reason.'),
  auditNode('audit-validator', 'Write Audit — Validator', [1640, 760], auditValidator, 'Supabase audit: agent=validator, status derived from VALIDATED/REJECTED.'),
  codeNode('format-validation', 'Format Validation Markdown', [1840, 760], body(fmtValidation), 'Renders the report to RESULTS/reports/*.validation.md (excluded from the filter).'),
  writeNode('write-validation', 'Write Validation (Obsidian)', [2040, 760], 'Obsidian PUT -> RESULTS/reports/*.validation.md. Does NOT re-trigger the Validator.'),
  agentNode(slug(A4), A4, [2240, 760], agentBody(2000, 'You are an Auditor agent. Summarize the change and its validation, and assess residual risk for the audit trail. Token budget: 2000.', AUDIT_SCHEMA, prompt4), 'Agent 4. Structured outputs. Runs after the Validator on any RESULTS/ commit.'),
  codeNode('parse-audit', 'Parse Audit', [2440, 760], body(parseAudit), 'Parses the Auditor JSON before the final Supabase write.'),
  auditNode('audit-auditor', 'Write Audit — Auditor', [2640, 760], auditAuditor, 'Supabase audit: agent=auditor, final commit-scoped record.'),

  codeNode('error-handler', 'Error Handler', [1240, 1080], body(errorHandler), 'Catches thrown errors from any read/merge/gate/agent/write node and logs status=error.')
];

// ---- connections ---------------------------------------------------------
const m = (name, i) => ({ node: name, type: 'main', index: i || 0 });
const connections = {};
const link = (from, to, withErr) => {
  connections[from] = connections[from] || {};
  connections[from].main = [[m(to)]];
  if (withErr) connections[from].error = [[m('Error Handler')]];
};

connections['GitHub Webhook'] = { main: [[m('Filter Task Files'), m('Filter Approved Files'), m('Filter Result Files')]] };

// task lane
link('Filter Task Files', 'Read Task File');
link('Read Task File', 'Merge Task Content', true);
link('Merge Task Content', 'Gate 1 — Sanitize (Task)', true);
link('Gate 1 — Sanitize (Task)', A1, true);
link(A1, 'Gate 2 — Validate Spec', true);
link('Gate 2 — Validate Spec', 'Write Audit — Task Analyzer', true);
link('Write Audit — Task Analyzer', 'Format SPEC Markdown');
link('Format SPEC Markdown', 'Write SPEC (Obsidian)', true);

// approved lane
link('Filter Approved Files', 'Read Approved File');
link('Read Approved File', 'Merge Approved Content', true);
link('Merge Approved Content', 'Gate 1 — Sanitize (Approved)', true);
link('Gate 1 — Sanitize (Approved)', A2, true);
link(A2, 'Gate 2 — Validate Plan', true);
link('Gate 2 — Validate Plan', 'Write Audit — Spec Generator', true);
link('Write Audit — Spec Generator', 'Format Plan Markdown');
link('Format Plan Markdown', 'Write PLAN (Obsidian)', true);

// result lane
link('Filter Result Files', 'Read Result File');
link('Read Result File', 'Merge Result Content', true);
link('Merge Result Content', 'Gate 1 — Sanitize (Result)', true);
link('Gate 1 — Sanitize (Result)', A3, true);
link(A3, 'Gate 2 — Validate Report', true);
link('Gate 2 — Validate Report', 'Write Audit — Validator', true);
link('Write Audit — Validator', 'Format Validation Markdown');
link('Format Validation Markdown', 'Write Validation (Obsidian)', true);
link('Write Validation (Obsidian)', A4, true);
link(A4, 'Parse Audit', true);
link('Parse Audit', 'Write Audit — Auditor');

// Terminal Obsidian write nodes have no main output; attach error-only branches
// so a failed vault write still routes to the Error Handler.
for (const terminal of ['Write SPEC (Obsidian)', 'Write PLAN (Obsidian)']) {
  connections[terminal] = connections[terminal] || {};
  connections[terminal].error = [[m('Error Handler')]];
}

const workflow = {
  name: 'AI Brain — Agent Pipeline v2',
  nodes, connections,
  settings: { executionOrder: 'v1', saveManualExecutions: true, callerPolicy: 'workflowsFromSameOwner', errorWorkflow: 'AI Brain Error Notifier' },
  staticData: null,
  meta: { templateCredsSetupCompleted: false, instanceId: 'ai-brain-v2' },
  _notes: {
    agents: [
      'Agent 1 (Task Analyzer): TASKS/*.md -> SPEC in OUTPUT/pending-review/ (5000 tok).',
      'Agent 2 (Spec Generator): OUTPUT/approved/*.md -> PLAN in RESULTS/ (8000 tok).',
      'Agent 3 (Validator): RESULTS/*.md -> report in RESULTS/reports/ (3000 tok).',
      'Agent 4 (Auditor): after the Validator on RESULTS/ commits -> Supabase audit summary (2000 tok).'
    ],
    obsidian_io: 'Each lane READS its file via Obsidian Local REST API (GET /vault/{path}) into file_content, and WRITES its output via PUT /vault/{path}. This is the concrete transport for the spec\'s "Obsidian MCP bridge" layer. Requires OBSIDIAN_API_URL + OBSIDIAN_API_KEY.',
    loop_guard: 'Validator reports are written to RESULTS/reports/, which the Filter Result Files node excludes, so a report never re-triggers the Validator. Agent 2 writing a PLAN to RESULTS/ intentionally triggers the Validator.',
    structured_outputs: 'All four agents use output_config.format (json_schema) on claude-sonnet-5 with thinking disabled; Gate 2 nodes enforce only business rules + write-path boundaries.',
    env_vars_required: [
      'ANTHROPIC_API_KEY — server-side only',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY — server-side only',
      'OBSIDIAN_API_URL — Obsidian Local REST API base (e.g. https://127.0.0.1:27124)',
      'OBSIDIAN_API_KEY — Obsidian Local REST API bearer token'
    ],
    github_webhook_setup: [
      '1. Vault repo on GitHub > Settings > Webhooks > Add webhook',
      '2. Payload URL: https://krosebrook.app.n8n.cloud/webhook/ai-brain-task-trigger',
      '3. Content type: application/json',
      '4. Secret: openssl rand -hex 32 -> store as N8N_WEBHOOK_SECRET',
      '5. Events: Just the push event'
    ]
  }
};

// ---- validate every embedded snippet before writing ----------------------
// Build-time only: new Function() is used purely to syntax-check snippets authored in
// THIS script (no external input). It is not part of the emitted workflow.
let errors = 0;
function checkExpr(where, value) {
  if (typeof value !== 'string' || value.indexOf('={{') !== 0 || value.slice(-2) !== '}}') return;
  const inner = value.slice(3, -2).trim();
  if (inner.indexOf('{{') !== -1 || inner.indexOf('}}') !== -1) return; // mixed n8n template (e.g. URL) — skip
  try { new Function('$env', '$json', '$', 'return (' + inner + ')'); }
  catch (e) { errors++; console.error('EXPR SYNTAX ERROR in "' + where + '": ' + e.message); }
}
function walk(where, obj) {
  if (obj == null) return;
  if (typeof obj === 'string') return checkExpr(where, obj);
  if (Array.isArray(obj)) return obj.forEach(v => walk(where, v));
  if (typeof obj === 'object') for (const k of Object.keys(obj)) walk(where, obj[k]);
}
for (const n of nodes) {
  if (n.type === 'n8n-nodes-base.code') {
    try { new Function(n.parameters.jsCode); }
    catch (e) { errors++; console.error('CODE SYNTAX ERROR in "' + n.name + '": ' + e.message); }
  } else {
    walk(n.name, n.parameters);
  }
}
if (errors) { console.error('ABORT: ' + errors + ' snippet(s) failed syntax check.'); process.exit(1); }

fs.writeFileSync(OUT, JSON.stringify(workflow, null, 2) + '\n');
JSON.parse(fs.readFileSync(OUT, 'utf8'));
console.log('OK: wrote ' + nodes.length + ' nodes; all snippets syntax-checked; JSON round-trips.');
