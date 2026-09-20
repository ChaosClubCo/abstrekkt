import axios from 'axios';
import type {
  EmailTemplate,
  EmailTemplateKey,
  SendEmailInput,
  SendEmailResult,
  UpdateTemplateInput,
  EmailPreview,
} from '../types';

const API_BASE = '/api/email';

export async function getTemplates(): Promise<EmailTemplate[]> {
  const response = await axios.get<EmailTemplate[]>(`${API_BASE}/templates`);
  return response.data;
}

export async function getTemplate(key: EmailTemplateKey, locale?: string): Promise<EmailTemplate> {
  const response = await axios.get<EmailTemplate>(`${API_BASE}/templates/${key}`, {
    params: { locale },
  });
  return response.data;
}

export async function updateTemplate(
  key: EmailTemplateKey,
  input: UpdateTemplateInput,
  locale?: string
): Promise<EmailTemplate> {
  const response = await axios.patch<EmailTemplate>(`${API_BASE}/templates/${key}`, input, {
    params: { locale },
  });
  return response.data;
}

export async function previewTemplate(
  key: EmailTemplateKey,
  variables: Record<string, unknown>
): Promise<EmailPreview> {
  const response = await axios.post<EmailPreview>(`${API_BASE}/templates/${key}/preview`, {
    variables,
  });
  return response.data;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const response = await axios.post<SendEmailResult>(`${API_BASE}/send`, input);
  return response.data;
}

export async function sendTestEmail(
  key: EmailTemplateKey,
  to: string
): Promise<SendEmailResult> {
  const response = await axios.post<SendEmailResult>(`${API_BASE}/templates/${key}/test`, { to });
  return response.data;
}

export async function resetTemplate(key: EmailTemplateKey): Promise<EmailTemplate> {
  const response = await axios.post<EmailTemplate>(`${API_BASE}/templates/${key}/reset`);
  return response.data;
}
