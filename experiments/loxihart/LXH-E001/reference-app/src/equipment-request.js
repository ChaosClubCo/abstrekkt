export const Roles = Object.freeze({ EMPLOYEE: 'EMPLOYEE', MANAGER: 'MANAGER', IT: 'IT', ADMIN: 'ADMIN' });
export const States = Object.freeze({ SUBMITTED: 'SUBMITTED', MANAGER_APPROVED: 'MANAGER_APPROVED', MANAGER_REJECTED: 'MANAGER_REJECTED', IT_APPROVED: 'IT_APPROVED', IT_REJECTED: 'IT_REJECTED', FULFILLED: 'FULFILLED', CLOSED: 'CLOSED' });

const transitions = new Map([
  [States.SUBMITTED, new Set([States.MANAGER_APPROVED, States.MANAGER_REJECTED])],
  [States.MANAGER_APPROVED, new Set([States.IT_APPROVED, States.IT_REJECTED])],
  [States.IT_APPROVED, new Set([States.FULFILLED])],
  [States.FULFILLED, new Set([States.CLOSED])]
]);

export class WorkflowError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = 'WorkflowError';
    this.code = code;
    this.status = status;
  }
}

export function canRead(user, request) {
  if (!user) return false;
  if (user.role === Roles.ADMIN || user.role === Roles.IT) return true;
  if (user.role === Roles.EMPLOYEE) return user.id === request.employeeId;
  if (user.role === Roles.MANAGER) return user.id === request.managerId;
  return false;
}

export function canTransition(user, request, nextState) {
  if (!user) return false;
  const allowed = transitions.get(request.state);
  if (!allowed?.has(nextState)) return false;
  if (request.state === States.SUBMITTED) return user.role === Roles.MANAGER && user.id === request.managerId;
  if (request.state === States.MANAGER_APPROVED) return user.role === Roles.IT;
  if (request.state === States.IT_APPROVED) return user.role === Roles.IT;
  if (request.state === States.FULFILLED) return user.role === Roles.IT || user.role === Roles.ADMIN;
  return false;
}

export function createRequest({ id, employeeId, managerId, item, justification }) {
  if (![id, employeeId, managerId, item, justification].every(v => typeof v === 'string' && v.trim().length > 0)) {
    throw new WorkflowError('INVALID_INPUT', 'All request fields are required', 422);
  }
  if (item.length > 200 || justification.length > 2000) {
    throw new WorkflowError('INVALID_INPUT', 'Input exceeds maximum length', 422);
  }
  const now = new Date().toISOString();
  return {
    id,
    employeeId,
    managerId,
    item,
    justification,
    state: States.SUBMITTED,
    comments: [],
    audit: [{ event: 'REQUEST_CREATED', actorId: employeeId, at: now }],
    createdAt: now,
    updatedAt: now
  };
}

export function transitionRequest(user, request, nextState) {
  if (!canTransition(user, request, nextState)) {
    throw new WorkflowError('FORBIDDEN_TRANSITION', 'Transition not permitted', 403);
  }
  const now = new Date().toISOString();
  return {
    ...request,
    state: nextState,
    updatedAt: now,
    audit: [...request.audit, { event: 'STATE_CHANGED', from: request.state, to: nextState, actorId: user.id, at: now }]
  };
}

export function addComment(user, request, body) {
  if (!canRead(user, request)) throw new WorkflowError('FORBIDDEN', 'Request is not visible to user', 403);
  if (typeof body !== 'string' || body.trim().length === 0 || body.length > 2000) {
    throw new WorkflowError('INVALID_COMMENT', 'Comment must be 1-2000 characters', 422);
  }
  const at = new Date().toISOString();
  return {
    ...request,
    comments: [...request.comments, { actorId: user.id, body: body.trim(), at }],
    updatedAt: at,
    audit: [...request.audit, { event: 'COMMENT_ADDED', actorId: user.id, at }]
  };
}

export function summarize(requests) {
  return requests.reduce((acc, request) => {
    acc.total += 1;
    acc.byState[request.state] = (acc.byState[request.state] ?? 0) + 1;
    return acc;
  }, { total: 0, byState: {} });
}
