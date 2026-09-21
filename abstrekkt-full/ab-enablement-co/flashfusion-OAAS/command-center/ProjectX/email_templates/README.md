# Email Templates Module

Transactional email system with customizable templates.

## Features

- **Pre-built Templates**: Welcome, password reset, invoices, etc.
- **Template Editor**: Visual editor with live preview
- **Variable Substitution**: Dynamic content injection
- **Multi-language**: i18n support for templates
- **Email Sending**: Integration with email providers

## Usage

```tsx
import {
  sendEmail,
  EmailTemplateEditor,
  useEmailTemplates
} from '@projectx/email_templates';

// Send a transactional email
await sendEmail({
  template: 'welcome',
  to: 'user@example.com',
  variables: {
    userName: 'John',
    activationLink: 'https://...'
  }
});

// Manage templates
function EmailSettings() {
  const { templates, updateTemplate } = useEmailTemplates();

  return (
    <EmailTemplateEditor
      template={templates.welcome}
      onSave={updateTemplate}
    />
  );
}
```

## Built-in Templates

| Template | Description |
|----------|-------------|
| `welcome` | New user welcome email |
| `password_reset` | Password reset link |
| `email_verification` | Verify email address |
| `team_invitation` | Team invite email |
| `invoice` | Monthly invoice |
| `subscription_cancelled` | Cancellation confirmation |

## Template Variables

```handlebars
Hello {{userName}},

Welcome to {{companyName}}! Click below to get started:

{{#if activationLink}}
  <a href="{{activationLink}}">Activate Account</a>
{{/if}}

Best regards,
The {{companyName}} Team
```
