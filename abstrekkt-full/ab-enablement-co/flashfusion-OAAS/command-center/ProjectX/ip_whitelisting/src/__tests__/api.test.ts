/**
 * Tests for IP Whitelisting API functions
 *
 * Tests all API endpoints for IP rules, access checking, geolocation,
 * grace period requests, and session binding
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as api from '../api';
import {
  mockRules,
  mockIPRule,
  mockConfig,
  mockAccessAllowed,
  mockAccessDenied,
  mockGeoLocation,
  mockAccessAttempts,
  mockPendingGraceRequests,
  mockGracePeriodRequest,
  mockSessionIPInfo,
  mockMyIP,
  mockCreateRuleInput,
} from './fixtures';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('IP Whitelisting API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ===========================================================================
  // checkIPAccess Tests
  // ===========================================================================

  describe('checkIPAccess', () => {
    it('should check IP access and return allowed result', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAccessAllowed),
      });

      const result = await api.checkIPAccess();

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/check');
      expect(result).toEqual(mockAccessAllowed);
      expect(result.allowed).toBe(true);
    });

    it('should check IP access and return denied result', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAccessDenied),
      });

      const result = await api.checkIPAccess();

      expect(result).toEqual(mockAccessDenied);
      expect(result.allowed).toBe(false);
    });

    it('should throw error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(api.checkIPAccess()).rejects.toThrow('Failed to check IP access');
    });

    it('should throw error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.checkIPAccess()).rejects.toThrow('Network error');
    });
  });

  // ===========================================================================
  // checkIPAccessForAddress Tests
  // ===========================================================================

  describe('checkIPAccessForAddress', () => {
    it('should check access for a specific IP address', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAccessAllowed),
      });

      const result = await api.checkIPAccessForAddress('192.168.1.100');

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/check/192.168.1.100');
      expect(result).toEqual(mockAccessAllowed);
    });

    it('should throw error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(api.checkIPAccessForAddress('invalid-ip')).rejects.toThrow(
        'Failed to check IP access'
      );
    });
  });

  // ===========================================================================
  // getConfig Tests
  // ===========================================================================

  describe('getConfig', () => {
    it('should fetch IP whitelist config', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockConfig),
      });

      const result = await api.getConfig();

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/config');
      expect(result).toEqual(mockConfig);
      expect(result.enabled).toBe(true);
    });

    it('should throw error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(api.getConfig()).rejects.toThrow('Failed to fetch IP whitelist config');
    });
  });

  // ===========================================================================
  // updateConfig Tests
  // ===========================================================================

  describe('updateConfig', () => {
    it('should update config with partial data', async () => {
      const updatedConfig = { ...mockConfig, enabled: false };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedConfig),
      });

      const result = await api.updateConfig({ enabled: false });

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: false }),
      });
      expect(result.enabled).toBe(false);
    });

    it('should update multiple config fields', async () => {
      const updates = { enabled: true, enforceForAdmins: true };
      const updatedConfig = { ...mockConfig, ...updates };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedConfig),
      });

      const result = await api.updateConfig(updates);

      expect(result.enabled).toBe(true);
      expect(result.enforceForAdmins).toBe(true);
    });

    it('should throw error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      await expect(api.updateConfig({ enabled: true })).rejects.toThrow(
        'Failed to update IP whitelist config'
      );
    });
  });

  // ===========================================================================
  // getRules Tests
  // ===========================================================================

  describe('getRules', () => {
    it('should fetch all IP rules', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRules),
      });

      const result = await api.getRules();

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/rules');
      expect(result).toEqual(mockRules);
      expect(result).toHaveLength(5);
    });

    it('should return empty array when no rules exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const result = await api.getRules();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should throw error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(api.getRules()).rejects.toThrow('Failed to fetch IP rules');
    });
  });

  // ===========================================================================
  // createRule Tests
  // ===========================================================================

  describe('createRule', () => {
    it('should create a new IP rule', async () => {
      const newRule = { ...mockIPRule, id: 'new-rule-1', ...mockCreateRuleInput };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(newRule),
      });

      const result = await api.createRule(mockCreateRuleInput);

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCreateRuleInput),
      });
      expect(result.value).toBe(mockCreateRuleInput.value);
    });

    it('should create a CIDR rule', async () => {
      const cidrInput = { type: 'cidr' as const, value: '10.0.0.0/8', action: 'allow' as const };
      const newRule = { ...mockIPRule, id: 'cidr-rule-1', ...cidrInput };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(newRule),
      });

      const result = await api.createRule(cidrInput);

      expect(result.type).toBe('cidr');
      expect(result.value).toBe('10.0.0.0/8');
    });

    it('should throw error when creation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(api.createRule(mockCreateRuleInput)).rejects.toThrow(
        'Failed to create IP rule'
      );
    });
  });

  // ===========================================================================
  // updateRule Tests
  // ===========================================================================

  describe('updateRule', () => {
    it('should update an existing rule', async () => {
      const updatedRule = { ...mockIPRule, label: 'Updated Label' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedRule),
      });

      const result = await api.updateRule('rule-1', { label: 'Updated Label' });

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/rules/rule-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: 'Updated Label' }),
      });
      expect(result.label).toBe('Updated Label');
    });

    it('should update rule enabled status', async () => {
      const updatedRule = { ...mockIPRule, enabled: false };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedRule),
      });

      const result = await api.updateRule('rule-1', { enabled: false });

      expect(result.enabled).toBe(false);
    });

    it('should throw error when update fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(api.updateRule('non-existent', { label: 'Test' })).rejects.toThrow(
        'Failed to update IP rule'
      );
    });
  });

  // ===========================================================================
  // deleteRule Tests
  // ===========================================================================

  describe('deleteRule', () => {
    it('should delete a rule by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await api.deleteRule('rule-1');

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/rules/rule-1', {
        method: 'DELETE',
      });
    });

    it('should throw error when deletion fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(api.deleteRule('non-existent')).rejects.toThrow('Failed to delete IP rule');
    });
  });

  // ===========================================================================
  // toggleRule Tests
  // ===========================================================================

  describe('toggleRule', () => {
    it('should enable a disabled rule', async () => {
      const enabledRule = { ...mockIPRule, enabled: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(enabledRule),
      });

      const result = await api.toggleRule('rule-1', true);

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/rules/rule-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: true }),
      });
      expect(result.enabled).toBe(true);
    });

    it('should disable an enabled rule', async () => {
      const disabledRule = { ...mockIPRule, enabled: false };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(disabledRule),
      });

      const result = await api.toggleRule('rule-1', false);

      expect(result.enabled).toBe(false);
    });
  });

  // ===========================================================================
  // getAccessAttempts Tests
  // ===========================================================================

  describe('getAccessAttempts', () => {
    it('should fetch access attempts without filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAccessAttempts),
      });

      const result = await api.getAccessAttempts();

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/access-attempts?');
      expect(result).toEqual(mockAccessAttempts);
    });

    it('should fetch access attempts with user filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockAccessAttempts[0]]),
      });

      const result = await api.getAccessAttempts({ userId: 'user-1' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/ip-whitelist/access-attempts?userId=user-1'
      );
      expect(result).toHaveLength(1);
    });

    it('should fetch access attempts with multiple filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await api.getAccessAttempts({
        userId: 'user-1',
        ipAddress: '192.168.1.100',
        action: 'allow',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        limit: 10,
        offset: 0,
      });

      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain('userId=user-1');
      expect(calledUrl).toContain('ipAddress=192.168.1.100');
      expect(calledUrl).toContain('action=allow');
      expect(calledUrl).toContain('startDate=2024-01-01');
      expect(calledUrl).toContain('endDate=2024-01-31');
      expect(calledUrl).toContain('limit=10');
      expect(calledUrl).toContain('offset=0');
    });

    it('should throw error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(api.getAccessAttempts()).rejects.toThrow('Failed to fetch access attempts');
    });
  });

  // ===========================================================================
  // getGeoLocation Tests
  // ===========================================================================

  describe('getGeoLocation', () => {
    it('should fetch geolocation for current IP', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGeoLocation),
      });

      const result = await api.getGeoLocation();

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/geo');
      expect(result).toEqual(mockGeoLocation);
    });

    it('should fetch geolocation for specific IP', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGeoLocation),
      });

      const result = await api.getGeoLocation('8.8.8.8');

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/geo/8.8.8.8');
      expect(result).toEqual(mockGeoLocation);
    });

    it('should throw error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(api.getGeoLocation()).rejects.toThrow('Failed to fetch geolocation');
    });
  });

  // ===========================================================================
  // Grace Period Request Tests
  // ===========================================================================

  describe('getGracePeriodRequests', () => {
    it('should fetch all grace period requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPendingGraceRequests),
      });

      const result = await api.getGracePeriodRequests();

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/grace-period');
      expect(result).toEqual(mockPendingGraceRequests);
    });

    it('should fetch grace period requests by status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPendingGraceRequests),
      });

      const result = await api.getGracePeriodRequests('pending');

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/grace-period?status=pending');
      expect(result).toEqual(mockPendingGraceRequests);
    });

    it('should throw error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(api.getGracePeriodRequests()).rejects.toThrow(
        'Failed to fetch grace period requests'
      );
    });
  });

  describe('createGracePeriodRequest', () => {
    it('should create a grace period request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGracePeriodRequest),
      });

      const result = await api.createGracePeriodRequest('Working from home today');

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/grace-period', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Working from home today' }),
      });
      expect(result).toEqual(mockGracePeriodRequest);
    });

    it('should throw error when creation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      await expect(api.createGracePeriodRequest('Test reason')).rejects.toThrow(
        'Failed to create grace period request'
      );
    });
  });

  describe('reviewGracePeriodRequest', () => {
    it('should approve a grace period request', async () => {
      const approvedRequest = { ...mockGracePeriodRequest, status: 'approved' as const };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(approvedRequest),
      });

      const result = await api.reviewGracePeriodRequest('grace-1', 'approve');

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/grace-period/grace-1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      expect(result.status).toBe('approved');
    });

    it('should deny a grace period request', async () => {
      const deniedRequest = { ...mockGracePeriodRequest, status: 'denied' as const };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(deniedRequest),
      });

      const result = await api.reviewGracePeriodRequest('grace-1', 'deny');

      expect(result.status).toBe('denied');
    });

    it('should throw error when review fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(api.reviewGracePeriodRequest('invalid', 'approve')).rejects.toThrow(
        'Failed to review grace period request'
      );
    });
  });

  // ===========================================================================
  // Session Binding Tests
  // ===========================================================================

  describe('getSessionIPInfo', () => {
    it('should fetch session IP info', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSessionIPInfo),
      });

      const result = await api.getSessionIPInfo();

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/session-ip');
      expect(result).toEqual(mockSessionIPInfo);
    });

    it('should throw error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(api.getSessionIPInfo()).rejects.toThrow('Failed to fetch session IP info');
    });
  });

  describe('bindSessionToIP', () => {
    it('should bind session to current IP', async () => {
      const boundSession = { ...mockSessionIPInfo, isBound: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(boundSession),
      });

      const result = await api.bindSessionToIP();

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/session-ip/bind', {
        method: 'POST',
      });
      expect(result.isBound).toBe(true);
    });

    it('should throw error when binding fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(api.bindSessionToIP()).rejects.toThrow('Failed to bind session to IP');
    });
  });

  // ===========================================================================
  // CIDR Validation Tests
  // ===========================================================================

  describe('validateCIDR', () => {
    it('should validate a valid CIDR notation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ valid: true }),
      });

      const result = await api.validateCIDR('192.168.1.0/24');

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/validate/cidr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cidr: '192.168.1.0/24' }),
      });
      expect(result.valid).toBe(true);
    });

    it('should return invalid for incorrect CIDR', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ valid: false, error: 'Invalid CIDR notation' }),
      });

      const result = await api.validateCIDR('192.168.1.0/33');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid CIDR notation');
    });

    it('should handle non-ok response by returning json (no throw)', async () => {
      // validateCIDR doesn't throw on non-ok, it just returns the json
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ valid: false, error: 'Server error' }),
      });

      const result = await api.validateCIDR('invalid');

      expect(result.valid).toBe(false);
    });
  });

  // ===========================================================================
  // getMyIP Tests
  // ===========================================================================

  describe('getMyIP', () => {
    it('should fetch current IP with geolocation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMyIP),
      });

      const result = await api.getMyIP();

      expect(mockFetch).toHaveBeenCalledWith('/api/ip-whitelist/my-ip');
      expect(result).toEqual(mockMyIP);
      expect(result.ip).toBe('192.168.1.100');
      expect(result.geo).toEqual(mockGeoLocation);
    });

    it('should throw error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(api.getMyIP()).rejects.toThrow('Failed to fetch current IP');
    });
  });
});
