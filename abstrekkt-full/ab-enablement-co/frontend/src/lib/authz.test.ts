import { describe, expect, it } from 'vitest';
import { can } from './authz';

describe('authz', () => {
  it('allows owners to manage settings', () => {
    expect(can('owner', 'settings:manage')).toBe(true);
  });

  it('blocks client viewers from running agents', () => {
    expect(can('client_viewer', 'agent:run')).toBe(false);
  });
});
