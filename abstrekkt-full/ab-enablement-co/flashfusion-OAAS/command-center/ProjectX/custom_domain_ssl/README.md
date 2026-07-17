# Custom Domains & SSL Management Demo

This module provides a starting point for adding custom domain support and SSL certificate management to your FlashFusion deployments. It includes a hook (`useCustomDomain`) to manage domain states and a demo component (`CustomDomainSSL`) for adding domains, verifying DNS records, and enabling SSL.

## Features

- Add a domain name (e.g. `myapp.com`) to the project.
- Simulate DNS verification and automatically mark the domain as active after a delay.
- Enable SSL (HTTPS) for verified domains.
- Maintain logs of domain operations (add, verify, enable SSL).

## Files

| File | Purpose |
|------|---------|
| `useCustomDomain.ts` | Hook managing the list of domain configurations, including their status and whether SSL is enabled. Provides functions to add domains, start verification and enable SSL, and logs actions. |
| `CustomDomainSSL.tsx` | Demo component that allows users to add domains, lists them with statuses, and shows actions for verification and enabling SSL. |
| `README.md` | This file. Explains usage and extension ideas. |
| `PRODUCTION_PLAN.md` | Roadmap for implementing real custom domain and SSL management using DNS providers and certificate authorities. |

## Usage

1. Copy the `custom_domain_ssl` directory into your project.
2. Import and render the `CustomDomainSSL` component where you want users to manage custom domains:

```tsx
import CustomDomainSSL from './custom_domain_ssl/CustomDomainSSL';

function DomainSettings() {
  return <CustomDomainSSL />;
}
```

3. Replace the simulated verification and SSL enabling logic in `useCustomDomain` with calls to your backend infrastructure that interact with DNS providers (e.g. Cloudflare, Route53) and certificate management services (e.g. Let’s Encrypt via ACME). Use asynchronous APIs and update domain status accordingly.

## Extending the Module

- **DNS record management:** Provide instructions or automated DNS record creation (e.g. CNAME or A records) for verifying domains. Use DNS provider APIs to set records on the user’s behalf.
- **Certificate issuance:** Integrate with ACME clients or managed SSL services to request and renew certificates automatically.
- **Error handling:** Surface errors encountered during verification or SSL setup (e.g. DNS propagation delays, certificate issuance failures).
- **Multiple domains:** Support multiple domains per project (e.g. `www` and root domain). Allow alias and redirect configuration.
- **Certificate renewal:** Automatically renew SSL certificates before expiration. Alert users to upcoming expirations.
- **Access control:** Restrict domain management actions to authorized users (e.g. project owners or admins).

For a detailed plan to production, refer to **PRODUCTION_PLAN.md**.