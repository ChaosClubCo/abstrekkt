import { canRead, WorkflowError } from './equipment-request.js';

export function getRequestForUser(user, request) {
  if (!canRead(user, request)) throw new WorkflowError('FORBIDDEN', 'Request is not visible to user', 403);
  return request;
}
