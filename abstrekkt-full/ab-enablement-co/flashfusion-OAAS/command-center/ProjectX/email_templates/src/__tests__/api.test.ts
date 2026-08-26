import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as api from '../api';
import {
  mockTemplate,
  mockTemplates,
  mockPreview,
  mockSendResult,
  mockUpdateInput,
  mockSendInput,
} from './fixtures';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Email Templates API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTemplates', () => {
    it('should fetch all templates', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockTemplates });

      const result = await api.getTemplates();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/email/templates');
      expect(result).toEqual(mockTemplates);
    });

    it('should return empty array when no templates', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const result = await api.getTemplates();

      expect(result).toEqual([]);
    });
  });

  describe('getTemplate', () => {
    it('should fetch a single template by key', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockTemplate });

      const result = await api.getTemplate('welcome');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/email/templates/welcome', { params: { locale: undefined } });
      expect(result).toEqual(mockTemplate);
    });

    it('should fetch template with locale', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockTemplate });

      await api.getTemplate('welcome', 'es');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/email/templates/welcome', { params: { locale: 'es' } });
    });
  });

  describe('updateTemplate', () => {
    it('should update a template', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockTemplate, ...mockUpdateInput } });

      const result = await api.updateTemplate('welcome', mockUpdateInput);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/email/templates/welcome', mockUpdateInput, {
        params: { locale: undefined },
      });
      expect(result.subject).toBe(mockUpdateInput.subject);
    });

    it('should update template with locale', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: mockTemplate });

      await api.updateTemplate('welcome', mockUpdateInput, 'fr');

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/email/templates/welcome', mockUpdateInput, {
        params: { locale: 'fr' },
      });
    });

    it('should allow partial updates', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: mockTemplate });

      await api.updateTemplate('welcome', { subject: 'New subject' });

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        '/api/email/templates/welcome',
        { subject: 'New subject' },
        { params: { locale: undefined } }
      );
    });
  });

  describe('previewTemplate', () => {
    it('should preview a template with variables', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockPreview });

      const result = await api.previewTemplate('welcome', { appName: 'MyApp', userName: 'John' });

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/email/templates/welcome/preview', {
        variables: { appName: 'MyApp', userName: 'John' },
      });
      expect(result).toEqual(mockPreview);
    });
  });

  describe('sendEmail', () => {
    it('should send an email', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockSendResult });

      const result = await api.sendEmail(mockSendInput);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/email/send', mockSendInput);
      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg_abc123');
    });

    it('should handle send failure', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { success: false, error: 'Invalid recipient' } });

      const result = await api.sendEmail(mockSendInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid recipient');
    });
  });

  describe('sendTestEmail', () => {
    it('should send a test email', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockSendResult });

      const result = await api.sendTestEmail('welcome', 'test@example.com');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/email/templates/welcome/test', { to: 'test@example.com' });
      expect(result.success).toBe(true);
    });
  });

  describe('resetTemplate', () => {
    it('should reset a template to default', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockTemplate });

      const result = await api.resetTemplate('welcome');

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/email/templates/welcome/reset');
      expect(result).toEqual(mockTemplate);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from API', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.getTemplates()).rejects.toThrow('Network error');
    });

    it('should propagate errors for template fetch', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Template not found'));

      await expect(api.getTemplate('invalid' as any)).rejects.toThrow('Template not found');
    });

    it('should propagate errors for send', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('SMTP error'));

      await expect(api.sendEmail(mockSendInput)).rejects.toThrow('SMTP error');
    });
  });
});
