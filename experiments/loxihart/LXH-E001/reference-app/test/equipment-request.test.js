import test from 'node:test';
import assert from 'node:assert/strict';
import { Roles, States, createRequest, canRead, transitionRequest, addComment, summarize } from '../src/equipment-request.js';

const employee = { id: 'e1', role: Roles.EMPLOYEE };
const otherEmployee = { id: 'e2', role: Roles.EMPLOYEE };
const manager = { id: 'm1', role: Roles.MANAGER };
const otherManager = { id: 'm2', role: Roles.MANAGER };
const it = { id: 'it1', role: Roles.IT };

function fixture() {
  return createRequest({ id: 'r1', employeeId: employee.id, managerId: manager.id, item: 'Laptop', justification: 'Replacement device' });
}

test('employee can read own request but not another employee request', () => {
  const request = fixture();
  assert.equal(canRead(employee, request), true);
  assert.equal(canRead(otherEmployee, request), false);
});

test('assigned manager can read and approve submitted request', () => {
  let request = fixture();
  assert.equal(canRead(manager, request), true);
  request = transitionRequest(manager, request, States.MANAGER_APPROVED);
  assert.equal(request.state, States.MANAGER_APPROVED);
  assert.equal(request.audit.at(-1).to, States.MANAGER_APPROVED);
});

test('unassigned manager cannot approve request', () => {
  assert.throws(() => transitionRequest(otherManager, fixture(), States.MANAGER_APPROVED), e => e.code === 'FORBIDDEN_TRANSITION' && e.status === 403);
});

test('IT can approve after manager approval but cannot skip manager approval', () => {
  assert.throws(() => transitionRequest(it, fixture(), States.IT_APPROVED), e => e.code === 'FORBIDDEN_TRANSITION');
  const managerApproved = transitionRequest(manager, fixture(), States.MANAGER_APPROVED);
  assert.equal(transitionRequest(it, managerApproved, States.IT_APPROVED).state, States.IT_APPROVED);
});

test('illegal reverse transition is denied', () => {
  const managerApproved = transitionRequest(manager, fixture(), States.MANAGER_APPROVED);
  const itApproved = transitionRequest(it, managerApproved, States.IT_APPROVED);
  assert.throws(() => transitionRequest(it, itApproved, States.MANAGER_APPROVED), e => e.code === 'FORBIDDEN_TRANSITION');
});

test('comments require visibility and are audited', () => {
  const request = fixture();
  assert.throws(() => addComment(otherEmployee, request, 'nope'), e => e.status === 403);
  const updated = addComment(employee, request, 'Need this for travel.');
  assert.equal(updated.comments.length, 1);
  assert.equal(updated.audit.at(-1).event, 'COMMENT_ADDED');
});

test('oversized fields fail validation', () => {
  assert.throws(() => createRequest({ id: 'r2', employeeId: 'e1', managerId: 'm1', item: 'x'.repeat(201), justification: 'ok' }), e => e.status === 422);
});

test('reporting summarizes state counts deterministically', () => {
  const one = fixture();
  const two = { ...fixture(), id: 'r2' };
  assert.deepEqual(summarize([one, two]), { total: 2, byState: { SUBMITTED: 2 } });
});
