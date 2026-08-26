export interface EmailTemplate {
  id: string;
  key: EmailTemplateKey;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EmailTemplateKey =
  | 'welcome'
  | 'password_reset'
  | 'email_verification'
  | 'team_invitation'
  | 'invoice'
  | 'subscription_created'
  | 'subscription_cancelled'
  | 'payment_failed'
  | 'usage_alert'
  | 'security_alert';

export interface SendEmailInput {
  template: EmailTemplateKey;
  to: string | string[];
  variables: Record<string, string | number | boolean>;
  locale?: string;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface UpdateTemplateInput {
  subject?: string;
  htmlBody?: string;
  textBody?: string;
}

export interface EmailPreview {
  subject: string;
  html: string;
  text: string;
}
