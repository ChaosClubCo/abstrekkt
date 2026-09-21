import type {
  EmailTemplate,
  SendEmailInput,
  SendEmailResult,
  UpdateTemplateInput,
  EmailPreview,
} from '../types';

export const mockTemplate: EmailTemplate = {
  id: 'tmpl_001',
  key: 'welcome',
  name: 'Welcome Email',
  subject: 'Welcome to {{appName}}, {{userName}}!',
  htmlBody: '<h1>Welcome, {{userName}}!</h1><p>Thanks for joining {{appName}}.</p>',
  textBody: 'Welcome, {{userName}}! Thanks for joining {{appName}}.',
  variables: ['appName', 'userName'],
  locale: 'en',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
};

export const mockTemplates: EmailTemplate[] = [
  mockTemplate,
  {
    id: 'tmpl_002',
    key: 'password_reset',
    name: 'Password Reset',
    subject: 'Reset your password',
    htmlBody: '<h1>Password Reset</h1><p>Click <a href="{{resetLink}}">here</a> to reset.</p>',
    textBody: 'Click this link to reset your password: {{resetLink}}',
    variables: ['resetLink'],
    locale: 'en',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-10T00:00:00Z'),
  },
  {
    id: 'tmpl_003',
    key: 'team_invitation',
    name: 'Team Invitation',
    subject: '{{inviterName}} invited you to join {{teamName}}',
    htmlBody: '<p>{{inviterName}} has invited you to join {{teamName}}.</p>',
    textBody: '{{inviterName}} has invited you to join {{teamName}}.',
    variables: ['inviterName', 'teamName', 'inviteLink'],
    locale: 'en',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-05T00:00:00Z'),
  },
];

export const mockPreview: EmailPreview = {
  subject: 'Welcome to MyApp, John!',
  html: '<h1>Welcome, John!</h1><p>Thanks for joining MyApp.</p>',
  text: 'Welcome, John! Thanks for joining MyApp.',
};

export const mockSendResult: SendEmailResult = {
  success: true,
  messageId: 'msg_abc123',
};

export const mockSendError: SendEmailResult = {
  success: false,
  error: 'Invalid recipient address',
};

export const mockUpdateInput: UpdateTemplateInput = {
  subject: 'Welcome aboard, {{userName}}!',
  htmlBody: '<h1>Welcome aboard, {{userName}}!</h1>',
};

export const mockSendInput: SendEmailInput = {
  template: 'welcome',
  to: 'user@example.com',
  variables: { appName: 'MyApp', userName: 'John' },
};

export const mockSendInputMultiple: SendEmailInput = {
  template: 'team_invitation',
  to: ['user1@example.com', 'user2@example.com'],
  variables: { inviterName: 'Jane', teamName: 'Engineering' },
  cc: ['manager@example.com'],
  bcc: ['admin@example.com'],
  replyTo: 'support@example.com',
};
