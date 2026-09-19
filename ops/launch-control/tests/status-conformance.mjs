import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const fixtures = JSON.parse(fs.readFileSync(path.join(__dirname, 'status-fixtures.json'), 'utf8'));
const statusContract = fs.readFileSync(path.join(root, 'status-contract.yaml'), 'utf8');
const executionPlan = fs.readFileSync(path.join(root, 'execution-plan.yaml'), 'utf8');

const baseState = {
  product_id: 'test-product',
  canonical_product_id: true,
  required_checks: ['CHK-1'],
  lifecycle_state: 'VERIFYING',
  release_commit_sha: 'sha-current',
  release_build_id: 'build-current',
  current_evidence_set_exists: true,
  control_artifact_valid: true,
  evidence_records: [
    {
      check_id: 'CHK-1',
      current_result: 'PASS',
      provenance: 'EXECUTED',
      executed_at: '2026-08-17T08:40:00-05:00',
      verified_commit_sha: 'sha-current',
      verified_build_id: 'build-current',
      execution_ref: 'exec-pass',
      schema_valid: true,
      rerun_required: false,
      invalidated: false,
      build_bound: true
    }
  ],
  rerun_queue: {
    exists: true,
    pending: 0,
    blocked: 0,
    running: 0,
    failed: 0,
    unresolved: 0
  },
  baseline_mapping_gaps_open: 0,
  unknown_change_impacts_open: 0,
  unresolved_invalidation_events: 0
};

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base, override) {
  if (!isObject(base) || !isObject(override)) return override;
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (isObject(value) && isObject(base[key])) out[key] = deepMerge(base[key], value);
    else out[key] = value;
  }
  return out;
}

function recordsForCheck(state, checkId) {
  return state.evidence_records.filter((record) => record.check_id === checkId);
}

function trustedRequiredFail(record, state) {
  const unique = recordsForCheck(state, record.check_id).length === 1;
  const buildBindingRequired = record.build_bound === true || record.verified_build_id != null;
  const buildBindingValid = !buildBindingRequired || (
    state.release_build_id != null && record.verified_build_id === state.release_build_id
  );

  return Boolean(
    state.canonical_product_id === true &&
    state.required_checks.includes(record.check_id) &&
    unique &&
    record.current_result === 'FAIL' &&
    record.provenance === 'EXECUTED' &&
    record.executed_at &&
    record.verified_commit_sha &&
    record.verified_commit_sha === state.release_commit_sha &&
    record.execution_ref &&
    record.schema_valid === true &&
    buildBindingValid
  );
}

function evidenceCardinalityValid(state) {
  if (!state.current_evidence_set_exists) return true;
  return state.required_checks.every((id) => recordsForCheck(state, id).length === 1) &&
    state.evidence_records.every((record) => state.required_checks.includes(record.check_id));
}

function queueFailureConsistency(state) {
  if (state.rerun_queue.failed === 0) return { valid: true, blocker: null };
  const failRecords = state.evidence_records.filter((record) => record.current_result === 'FAIL');
  if (failRecords.length === 0) return { valid: false, blocker: 'CONTROL_EVIDENCE_INCONSISTENCY' };
  if (!failRecords.some((record) => trustedRequiredFail(record, state))) {
    return { valid: false, blocker: 'CONTROL_EVIDENCE_INCONSISTENCY' };
  }
  return { valid: true, blocker: null };
}

function holdToGo(state) {
  if (!['VERIFYING', 'RELEASE_CANDIDATE', 'RELEASED'].includes(state.lifecycle_state)) return false;
  if (!state.release_commit_sha || !state.release_build_id) return false;
  if (!state.current_evidence_set_exists) return false;
  if (!evidenceCardinalityValid(state)) return false;
  if (state.evidence_records.length !== state.required_checks.length) return false;

  for (const checkId of state.required_checks) {
    const record = recordsForCheck(state, checkId)[0];
    if (!record || record.current_result !== 'PASS') return false;
    if (record.provenance !== 'EXECUTED') return false;
    if (record.verified_commit_sha !== state.release_commit_sha) return false;
    if (record.verified_build_id !== state.release_build_id) return false;
    if (record.rerun_required !== false) return false;
    if (record.invalidated !== false) return false;
  }

  const q = state.rerun_queue;
  if (q.pending || q.blocked || q.running || q.failed || q.unresolved) return false;
  if (state.baseline_mapping_gaps_open !== 0) return false;
  if (state.unknown_change_impacts_open !== 0) return false;
  if (state.unresolved_invalidation_events !== 0) return false;
  if (state.control_artifact_valid !== true) return false;
  return true;
}

function deriveStatus(state) {
  const blockers = [];
  const trustedFails = state.evidence_records.filter((record) => trustedRequiredFail(record, state));
  const rawFails = state.evidence_records.filter((record) => record.current_result === 'FAIL');

  if (trustedFails.length > 0) {
    return { status: 'STOP_SHIP', blockers, trusted_fail_count: trustedFails.length };
  }

  if (rawFails.length > 0) blockers.push('CONTROL_EVIDENCE_INCONSISTENCY');

  const queueConsistency = queueFailureConsistency(state);
  if (!queueConsistency.valid) blockers.push(queueConsistency.blocker);

  const cardinalityValid = evidenceCardinalityValid(state);
  const controlValid = state.control_artifact_valid === true && cardinalityValid;
  if (!controlValid) blockers.push('CONTROL_ARTIFACT_INVALID');

  if (!controlValid || blockers.includes('CONTROL_EVIDENCE_INCONSISTENCY')) {
    return { status: 'HOLD', blockers: [...new Set(blockers)], trusted_fail_count: 0 };
  }

  if (
    state.lifecycle_state === 'PLANNED' &&
    state.current_evidence_set_exists === false &&
    state.rerun_queue.exists === false
  ) {
    return { status: 'NOT_STARTED', blockers: [], trusted_fail_count: 0 };
  }

  if (holdToGo(state)) {
    return { status: 'GO', blockers: [], trusted_fail_count: 0 };
  }

  return { status: 'HOLD', blockers: [...new Set(blockers)], trusted_fail_count: 0 };
}

function requireAnchor(text, fragment, id, failures) {
  if (!text.includes(fragment)) failures.push({ id, message: `Missing contract anchor: ${fragment}` });
}

function staticContractChecks() {
  const failures = [];
  requireAnchor(statusContract, 'status: STOP_SHIP', 'STATIC-PRECEDENCE-STOP', failures);
  requireAnchor(statusContract, 'rule: trusted_required_fail_exists', 'STATIC-TRUSTED-FAIL', failures);
  requireAnchor(statusContract, 'blocker_code: CONTROL_ARTIFACT_INVALID', 'STATIC-CONTROL-HOLD', failures);
  requireAnchor(statusContract, 'status: NOT_STARTED', 'STATIC-NOT-STARTED', failures);
  requireAnchor(statusContract, 'rule: hold_to_go_predicate', 'STATIC-GO', failures);
  requireAnchor(statusContract, 'blocker_code: CONTROL_EVIDENCE_INCONSISTENCY', 'STATIC-UNTRUSTED-FAIL', failures);
  requireAnchor(statusContract, 'release_build_id_present: true', 'STATIC-BUILD-ID', failures);
  requireAnchor(statusContract, 'every_required_record_provenance: EXECUTED', 'STATIC-EXECUTED-PASS', failures);

  requireAnchor(executionPlan, 'required_checks: 42', 'STATIC-42', failures);
  requireAnchor(executionPlan, 'current_not_run: 35', 'STATIC-35', failures);
  requireAnchor(executionPlan, 'current_blocked: 7', 'STATIC-7', failures);
  requireAnchor(executionPlan, 'prerequisite_waves: 3', 'STATIC-WAVES', failures);
  requireAnchor(executionPlan, 'count: 35', 'STATIC-WAVE1', failures);
  requireAnchor(executionPlan, 'count: 6', 'STATIC-WAVE2', failures);
  requireAnchor(executionPlan, 'count: 1', 'STATIC-WAVE3', failures);

  for (const product of ['crossing', 'sticker-room', 'kids-radio', 'voice-studio', 'release-tester']) {
    requireAnchor(executionPlan, `${product}:`, `STATIC-PRODUCT-${product}`, failures);
  }

  for (const gap of ['BMG-CROSS-001', 'BMG-TALK-001', 'BMG-TALK-002', 'BMG-BTA-001', 'BMG-BTA-002']) {
    requireAnchor(executionPlan, gap, `STATIC-GAP-${gap}`, failures);
  }

  // Adversarial semantic reachability check. Precedence says invalid control -> HOLD
  // before NOT_STARTED, while global control validity currently lists exact evidence
  // cardinality as a required assertion. If that assertion is universal, a PLANNED
  // product with no evidence can never reach NOT_STARTED. This must be scoped or clarified.
  const hasGlobalCardinalityAssertion = statusContract.includes('- exactly_one_current_evidence_record_per_required_check');
  const hasNoEvidenceNotStarted = statusContract.includes('- current_evidence_set_exists: false');
  const controlBeforeNotStarted = statusContract.indexOf('rule: control_plane_invalid') < statusContract.indexOf('rule: planned_without_evidence_or_queue');
  if (hasGlobalCardinalityAssertion && hasNoEvidenceNotStarted && controlBeforeNotStarted) {
    failures.push({
      id: 'SEMANTIC-NOT-STARTED-REACHABILITY',
      message: 'Potential contract contradiction: control-plane validity requires exact current evidence cardinality, but NOT_STARTED requires no current evidence and is evaluated after control invalidity. Scope the cardinality assertion to products with a current evidence set, or NOT_STARTED is unreachable under a strict evaluator.'
    });
  }

  return failures;
}

const behavioralResults = [];
for (const fixture of fixtures.cases) {
  const state = deepMerge(baseState, fixture.overrides || {});
  if (Object.hasOwn(fixture.overrides || {}, 'evidence_records') && !Object.hasOwn(fixture.overrides || {}, 'current_evidence_set_exists')) {
    state.current_evidence_set_exists = state.evidence_records.length > 0;
  }

  const actual = deriveStatus(state);
  const statusMatch = actual.status === fixture.expected_status;
  const blockerMatch = fixture.expected_blocker ? actual.blockers.includes(fixture.expected_blocker) : true;
  behavioralResults.push({
    id: fixture.id,
    description: fixture.description,
    expected_status: fixture.expected_status,
    actual_status: actual.status,
    expected_blocker: fixture.expected_blocker || null,
    actual_blockers: actual.blockers,
    pass: statusMatch && blockerMatch
  });
}

const behavioralFailures = behavioralResults.filter((result) => !result.pass);
const staticFailures = staticContractChecks();
const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  suite: 'launch-control-status-conformance',
  fixtures_total: behavioralResults.length,
  fixtures_passed: behavioralResults.length - behavioralFailures.length,
  fixtures_failed: behavioralFailures.length,
  static_contract_mismatches: staticFailures.length,
  overall: behavioralFailures.length === 0 && staticFailures.length === 0 ? 'PASS' : 'FAIL',
  behavioral_failures: behavioralFailures,
  contract_mismatches: staticFailures,
  results: behavioralResults
};

const reportPath = path.join(__dirname, 'conformance-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));

if (behavioralFailures.length > 0 || staticFailures.length > 0) process.exitCode = 1;
