import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  getFlags,
  getFlag,
  createFlag,
  updateFlag,
  deleteFlag,
  evaluateFlag,
  evaluateAllFlags,
  toggleFlag,
} from '../api';
import {
  mockFeatureFlag,
  mockFeatureFlags,
  mockCreateFlagInput,
  mockUpdateFlagInput,
  mockBasicContext,
  mockEnabledEvaluation,
  mockApiError,
  mockNotFoundError,
  mockConflictError,
  mockNetworkError,
} from './fixtures';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Feature Flags API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getFlags', () => {
    it('should fetch all feature flags', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockFeatureFlags });

      const result = await getFlags();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/feature-flags');
      expect(result).toEqual(mockFeatureFlags);
    });

    it('should return empty array when no flags exist', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const result = await getFlags();

      expect(result).toEqual([]);
    });

    it('should throw on network error', async () => {
      mockedAxios.get.mockRejectedValueOnce(mockNetworkError);

      await expect(getFlags()).rejects.toThrow('Network Error');
    });
  });

  describe('getFlag', () => {
    it('should fetch a single flag by key', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockFeatureFlag });

      const result = await getFlag('new_dashboard');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/feature-flags/new_dashboard');
      expect(result).toEqual(mockFeatureFlag);
    });

    it('should throw 404 when flag not found', async () => {
      mockedAxios.get.mockRejectedValueOnce(mockNotFoundError);

      await expect(getFlag('nonexistent')).rejects.toMatchObject(mockNotFoundError);
    });

    it('should handle keys with underscores and dashes', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockFeatureFlag });

      await getFlag('my_feature-flag');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/feature-flags/my_feature-flag');
    });
  });

  describe('createFlag', () => {
    it('should create a new feature flag', async () => {
      const createdFlag = { ...mockFeatureFlag, ...mockCreateFlagInput };
      mockedAxios.post.mockResolvedValueOnce({ data: createdFlag });

      const result = await createFlag(mockCreateFlagInput);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/feature-flags', mockCreateFlagInput);
      expect(result).toEqual(createdFlag);
    });

    it('should throw 409 on duplicate key', async () => {
      mockedAxios.post.mockRejectedValueOnce(mockConflictError);

      await expect(createFlag(mockCreateFlagInput)).rejects.toMatchObject(mockConflictError);
    });

    it('should create flag with rules', async () => {
      const inputWithRules = {
        ...mockCreateFlagInput,
        rules: [{ attribute: 'plan', operator: 'eq' as const, value: 'pro' }],
      };
      mockedAxios.post.mockResolvedValueOnce({ data: { ...mockFeatureFlag, ...inputWithRules } });

      await createFlag(inputWithRules);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/feature-flags', inputWithRules);
    });

    it('should create flag with variants', async () => {
      const inputWithVariants = {
        ...mockCreateFlagInput,
        variants: [
          { key: 'control', name: 'Control', weight: 50 },
          { key: 'treatment', name: 'Treatment', weight: 50 },
        ],
      };
      mockedAxios.post.mockResolvedValueOnce({ data: { ...mockFeatureFlag, ...inputWithVariants } });

      const result = await createFlag(inputWithVariants);

      expect(result.variants).toHaveLength(2);
    });

    it('should throw on invalid input', async () => {
      mockedAxios.post.mockRejectedValueOnce(mockApiError);

      await expect(createFlag({ ...mockCreateFlagInput, key: '' })).rejects.toMatchObject(mockApiError);
    });
  });

  describe('updateFlag', () => {
    it('should update an existing flag', async () => {
      const updatedFlag = { ...mockFeatureFlag, ...mockUpdateFlagInput };
      mockedAxios.patch.mockResolvedValueOnce({ data: updatedFlag });

      const result = await updateFlag('new_dashboard', mockUpdateFlagInput);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/feature-flags/new_dashboard', mockUpdateFlagInput);
      expect(result).toEqual(updatedFlag);
    });

    it('should allow partial updates', async () => {
      const partialUpdate = { enabled: false };
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockFeatureFlag, ...partialUpdate } });

      await updateFlag('new_dashboard', partialUpdate);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/feature-flags/new_dashboard', partialUpdate);
    });

    it('should update rollout percentage', async () => {
      const rolloutUpdate = { rolloutPercentage: 25 };
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockFeatureFlag, ...rolloutUpdate } });

      const result = await updateFlag('new_dashboard', rolloutUpdate);

      expect(result.rolloutPercentage).toBe(25);
    });

    it('should update rules', async () => {
      const rulesUpdate = {
        rules: [{ attribute: 'email', operator: 'contains' as const, value: '@admin.com' }],
      };
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockFeatureFlag, rules: rulesUpdate.rules } });

      await updateFlag('new_dashboard', rulesUpdate);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/feature-flags/new_dashboard', rulesUpdate);
    });

    it('should throw 404 when flag not found', async () => {
      mockedAxios.patch.mockRejectedValueOnce(mockNotFoundError);

      await expect(updateFlag('nonexistent', mockUpdateFlagInput)).rejects.toMatchObject(mockNotFoundError);
    });
  });

  describe('deleteFlag', () => {
    it('should delete a flag', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: undefined });

      await deleteFlag('new_dashboard');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/feature-flags/new_dashboard');
    });

    it('should throw 404 when flag not found', async () => {
      mockedAxios.delete.mockRejectedValueOnce(mockNotFoundError);

      await expect(deleteFlag('nonexistent')).rejects.toMatchObject(mockNotFoundError);
    });
  });

  describe('evaluateFlag', () => {
    it('should evaluate a single flag', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockEnabledEvaluation });

      const result = await evaluateFlag('new_dashboard', mockBasicContext);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/feature-flags/new_dashboard/evaluate',
        mockBasicContext
      );
      expect(result).toEqual(mockEnabledEvaluation);
    });

    it('should return disabled evaluation for disabled flag', async () => {
      const disabledEval = { enabled: false, reason: 'flag_disabled' };
      mockedAxios.post.mockResolvedValueOnce({ data: disabledEval });

      const result = await evaluateFlag('disabled_feature', mockBasicContext);

      expect(result.enabled).toBe(false);
      expect(result.reason).toBe('flag_disabled');
    });

    it('should return variant when applicable', async () => {
      const variantEval = { enabled: true, variant: 'treatment', reason: 'rule_matched' };
      mockedAxios.post.mockResolvedValueOnce({ data: variantEval });

      const result = await evaluateFlag('ab_test', mockBasicContext);

      expect(result.variant).toBe('treatment');
    });

    it('should handle context with custom attributes', async () => {
      const customContext = { ...mockBasicContext, customField: 'custom_value' };
      mockedAxios.post.mockResolvedValueOnce({ data: mockEnabledEvaluation });

      await evaluateFlag('new_dashboard', customContext);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/feature-flags/new_dashboard/evaluate',
        customContext
      );
    });

    it('should throw 404 when flag not found', async () => {
      mockedAxios.post.mockRejectedValueOnce(mockNotFoundError);

      await expect(evaluateFlag('nonexistent', mockBasicContext)).rejects.toMatchObject(mockNotFoundError);
    });
  });

  describe('evaluateAllFlags', () => {
    it('should evaluate all flags for a context', async () => {
      const allEvaluations = {
        new_dashboard: mockEnabledEvaluation,
        disabled_feature: { enabled: false, reason: 'flag_disabled' },
        ab_test: { enabled: true, variant: 'control', reason: 'default_enabled' },
      };
      mockedAxios.post.mockResolvedValueOnce({ data: allEvaluations });

      const result = await evaluateAllFlags(mockBasicContext);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/feature-flags/evaluate', mockBasicContext);
      expect(result).toEqual(allEvaluations);
    });

    it('should return empty object when no flags exist', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      const result = await evaluateAllFlags(mockBasicContext);

      expect(result).toEqual({});
    });

    it('should handle empty context', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      await evaluateAllFlags({});

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/feature-flags/evaluate', {});
    });
  });

  describe('toggleFlag', () => {
    it('should enable a flag', async () => {
      const enabledFlag = { ...mockFeatureFlag, enabled: true };
      mockedAxios.patch.mockResolvedValueOnce({ data: enabledFlag });

      const result = await toggleFlag('new_dashboard', true);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/feature-flags/new_dashboard', { enabled: true });
      expect(result.enabled).toBe(true);
    });

    it('should disable a flag', async () => {
      const disabledFlag = { ...mockFeatureFlag, enabled: false };
      mockedAxios.patch.mockResolvedValueOnce({ data: disabledFlag });

      const result = await toggleFlag('new_dashboard', false);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/feature-flags/new_dashboard', { enabled: false });
      expect(result.enabled).toBe(false);
    });

    it('should throw 404 when flag not found', async () => {
      mockedAxios.patch.mockRejectedValueOnce(mockNotFoundError);

      await expect(toggleFlag('nonexistent', true)).rejects.toMatchObject(mockNotFoundError);
    });
  });

  describe('error handling', () => {
    it('should handle 400 Bad Request', async () => {
      mockedAxios.post.mockRejectedValueOnce(mockApiError);

      await expect(createFlag(mockCreateFlagInput)).rejects.toMatchObject(mockApiError);
    });

    it('should handle 404 Not Found', async () => {
      mockedAxios.get.mockRejectedValueOnce(mockNotFoundError);

      await expect(getFlag('nonexistent')).rejects.toMatchObject(mockNotFoundError);
    });

    it('should handle 409 Conflict', async () => {
      mockedAxios.post.mockRejectedValueOnce(mockConflictError);

      await expect(createFlag(mockCreateFlagInput)).rejects.toMatchObject(mockConflictError);
    });

    it('should handle network errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(mockNetworkError);

      await expect(getFlags()).rejects.toThrow('Network Error');
    });
  });
});
