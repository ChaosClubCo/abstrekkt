import { clearConsoleToken, readConsoleToken } from './consoleToken';

export type ProxyOperation =
  | 'health'
  | 'pilot.read'
  | 'workflow.approve'
  | 'sop.approve'
  | 'baseline.lock'
  | 'change.approve'
  | 'evidence.append'
  | 'verification.commit'
  | 'stream.head'
  | 'stream.read'
  | 'receipt.read'
  | 'receipt.verify';

export class ControlApiError extends Error {
  status: number;
  code?: string;
  currentVersion?: number;

  constructor(message: string, status: number, code?: string, currentVersion?: number) {
    super(message);
    this.name = 'ControlApiError';
    this.status = status;
    this.code = code;
    this.currentVersion = currentVersion;
  }
}

function consoleHeaders(extra: Record<string, string>): Record<string, string> {
  const token = readConsoleToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

async function request<T>(operation: ProxyOperation, payload?: Record<string, unknown>): Promise<T> {
  const isRead = ['health', 'pilot.read', 'stream.head', 'stream.read'].includes(operation) && !payload;
  const response = await fetch(
    isRead ? `/api/loxihart?operation=${encodeURIComponent(operation)}` : '/api/loxihart',
    isRead
      ? { method: 'GET', headers: consoleHeaders({ Accept: 'application/json' }) }
      : {
          method: 'POST',
          headers: consoleHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
          body: JSON.stringify({ operation, ...(payload ?? {}) }),
        },
  );

  const raw = await response.text();
  let body: any = null;
  try { body = raw ? JSON.parse(raw) : null; } catch { body = raw; }

  if (!response.ok) {
    if (response.status === 401) clearConsoleToken();
    throw new ControlApiError(
      body?.error?.message ?? `Control API returned ${response.status}`,
      response.status,
      body?.error?.code,
      body?.error?.currentVersion,
    );
  }
  return body as T;
}

export const api = {
  health: () => request<any>('health'),
  readPilot: () => request<any>('pilot.read'),
  readStreamHead: () => request<any>('stream.head'),
  readStream: () => request<any>('stream.read'),
  approveWorkflow: (expectedVersion: number) => request<any>('workflow.approve', {
    expectedVersion,
    mutationId: `workflow-approve:${crypto.randomUUID()}`,
  }),
  approveSop: (expectedVersion: number) => request<any>('sop.approve', {
    expectedVersion,
    mutationId: `sop-approve:${crypto.randomUUID()}`,
  }),
  lockBaseline: (expectedVersion: number) => request<any>('baseline.lock', {
    expectedVersion,
    mutationId: `baseline-lock:${crypto.randomUUID()}`,
    acceptance: {
      criteriaVersion: 'lakeview-intake-v1',
      frozenAt: '2026-08-21T12:00:00.000Z',
      baselineMinSamples: 20,
      postChangeMinSamples: 20,
      primary: {
        id: 'complete-at-handoff',
        metric: 'complete_at_handoff_rate',
        operator: 'gte',
        absoluteTarget: 0.9,
        minRelativeImprovementPct: 25,
      },
      guardrails: [{
        id: 'assignment-time',
        metric: 'median_assignment_time_minutes',
        betterDirection: 'lower',
        maxRegressionPct: 10,
      }],
    },
    baseline: {
      metric: 'complete_at_handoff_rate',
      value: 0.6,
      sampleSize: 20,
      observedFrom: '2026-08-19T12:00:00.000Z',
      observedTo: '2026-08-20T12:00:00.000Z',
      evidenceRefs: ['ev-baseline'],
    },
  }),
  approveChange: (expectedVersion: number) => request<any>('change.approve', {
    expectedVersion,
    mutationId: `change-approve:${crypto.randomUUID()}`,
    occurredAt: '2026-08-22T14:00:00.000Z',
    change: {
      changeId: 'chg-required-dispatch-fields-v1',
      problem: 'Requests reach dispatch without all dispatch-critical information.',
      description: 'Require customer ID, service location, issue category, and equipment identifier before READY_FOR_ASSIGNMENT.',
      expectedResult: 'Increase complete-at-handoff rate to at least 90%.',
      rollback: 'Disable required-field validation and restore the prior intake behavior.',
      approvedAt: '2026-08-22T14:00:00.000Z',
      activatedAt: '2026-08-22T14:00:00.000Z',
      implementationEvidenceRefs: ['ev-implementation'],
      materialDeveloperIntervention: false,
    },
  }),
  appendPrimaryEvidence: (expectedVersion: number) => request<any>('evidence.append', {
    expectedVersion,
    mutationId: `evidence:${crypto.randomUUID()}`,
    evidence: {
      id: 'ev-postchange-primary',
      evidenceClass: 'DATASET',
      source: 'lakeview://post-change/requests-001',
      observedAt: '2026-08-30T18:00:00.000Z',
      sha256: 'bca89024a9cb09c6b8a00a8a44e15d1864ceee820b9def0ecb826dd0d3878abe',
      trustworthy: true,
    },
    observationComplete: false,
  }),
  appendGuardrailEvidence: (expectedVersion: number) => request<any>('evidence.append', {
    expectedVersion,
    mutationId: `evidence:${crypto.randomUUID()}`,
    evidence: {
      id: 'ev-postchange-guardrail',
      evidenceClass: 'DATASET',
      source: 'lakeview://post-change/assignment-time-001',
      observedAt: '2026-08-30T18:00:00.000Z',
      sha256: '9a0a28d2245ba6f00eb9a6f8a754e1d8277eaf9be323454de58a47be6bb0be2a',
      trustworthy: true,
    },
    observationComplete: true,
  }),
  commitVerification: (expectedVersion: number) => request<any>('verification.commit', {
    expectedVersion,
    mutationId: `verification:${crypto.randomUUID()}`,
    verificationAt: '2026-08-31T18:00:00.000Z',
    receiptAt: '2026-08-31T18:00:01.000Z',
    requestedAt: '2026-08-31T18:00:02.000Z',
    postChange: {
      metric: 'complete_at_handoff_rate',
      value: 0.95,
      sampleSize: 20,
      evidenceRefs: ['ev-postchange-primary'],
    },
    guardrails: [{
      metric: 'median_assignment_time_minutes',
      baselineValue: 25,
      postChangeValue: 26,
      evidenceRefs: ['ev-postchange-guardrail'],
    }],
  }),
  readReceipt: (receiptId: string) => request<any>('receipt.read', { receiptId }),
  verifyReceipt: (receiptId: string) => request<any>('receipt.verify', { receiptId }),
};
