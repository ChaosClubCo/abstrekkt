# Security Hardening

> **Audience**: Engineers securing PWA and Electron applications.
> **Diagrams**: `diagrams/security-boundaries`.
> **Compliance context**: SOC2, HIPAA, PCI-DSS considerations for Intinc clients.

---

## PWA Security

### Content Security Policy (CSP)

Every PWA should have a strict CSP. Set via HTTP header (preferred) or meta tag.

**Recommended baseline**:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.yourdomain.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

**Strictness levels**:
- `'unsafe-inline'` for styles: Required if using CSS-in-JS. Remove if possible.
- `'unsafe-eval'`: Never allow. If a library needs it, find an alternative.
- `script-src 'self'`: No inline scripts. Use `nonce` if you must inline.

### Service Worker Security

SWs have significant power — they intercept all network traffic. Securing them:

1. **Serve SW over HTTPS only** (browser enforces this, except localhost)
2. **Set `Cache-Control: no-cache`** on the SW file — prevents intermediary caches from serving stale SWs
3. **Validate fetch responses**: Check `response.ok` before caching. Don't cache error pages.
4. **Pin origins in fetch handler**: Only intercept same-origin requests. Never proxy cross-origin by default.
5. **Implement kill switch**: Deploy a SW that unregisters itself if you need to recover from a bad deployment.

```typescript
// Kill switch SW — deploy this to wipe a broken SW
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', async () => {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  const clients = await self.clients.matchAll();
  clients.forEach((client) => client.navigate(client.url));
  await self.registration.unregister();
});
```

### HTTPS & Transport Security

- **HSTS**: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- **Certificate pinning**: Not needed for most web apps, but consider for high-security APIs.
- **Mixed content**: Ensure ALL resources (images, fonts, scripts, APIs) are HTTPS.

---

## Electron Security

See `diagrams/security-boundaries.mermaid` for the trust boundary visualization.

### The Threat Model

The renderer process (your React app) may load untrusted content: user-generated HTML, embedded iframes, third-party scripts. If the renderer has direct access to Node.js, an XSS vulnerability becomes **Remote Code Execution**.

That's why the security model exists: renderer is sandboxed, all OS access goes through validated IPC channels.

### Mandatory Settings

```typescript
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,       // Never give renderer Node.js access
    contextIsolation: true,       // Separate renderer and preload contexts
    sandbox: true,                // Full Chromium sandbox
    webSecurity: true,            // Enforce same-origin policy
    allowRunningInsecureContent: false,
    preload: path.join(__dirname, 'preload.js'),
  },
});

// Prevent navigation to unexpected URLs
win.webContents.on('will-navigate', (event, url) => {
  const allowed = ['https://your-app.com', 'http://localhost:'];
  if (!allowed.some((a) => url.startsWith(a))) {
    event.preventDefault();
  }
});

// Block new window creation
win.webContents.setWindowOpenHandler(({ url }) => {
  shell.openExternal(url); // Open in default browser instead
  return { action: 'deny' };
});
```

### IPC Validation

Every IPC handler must validate its inputs:

```typescript
import { z } from 'zod';

const ReadFileSchema = z.object({
  path: z.string()
    .min(1)
    .refine((p) => !p.includes('..'), 'Path traversal not allowed')
    .refine((p) => ALLOWED_DIRS.some((d) => p.startsWith(d)), 'Path not in allowed directories'),
});

ipcMain.handle('fs:read-file', async (_event, rawPath: unknown) => {
  const { path: filePath } = ReadFileSchema.parse(rawPath);
  return readFile(filePath, 'utf-8');
});
```

### Supply Chain Security

Electron apps bundle Chromium and Node.js — large attack surfaces.

1. **Keep Electron updated**: Each release patches Chromium CVEs. Lag = vulnerability window.
2. **Audit dependencies**: `npm audit` in CI. Use `socket.dev` or Snyk for deeper analysis.
3. **Lock dependencies**: Use `package-lock.json` or `pnpm-lock.yaml`. Never `npm install` without lockfile.
4. **ASAR integrity**: Enable `asar` packaging with integrity checking to prevent tampering.
5. **Code signing**: Sign your app (macOS + Windows) to prevent tampering and establish trust.

---

## Compliance Considerations

### SOC2

Relevant controls for PWA/Electron:
- **CC6.1**: Logical access controls → IPC validation, CSP, sandboxing
- **CC6.6**: Transmission security → HTTPS, HSTS, TLS 1.2+
- **CC6.7**: Data at rest → IndexedDB encryption for sensitive data, Electron safeStorage API
- **CC7.1**: Monitoring → Error tracking (Sentry), audit logging

### HIPAA

If handling PHI (Protected Health Information):
- **Encryption at rest**: Use Electron's `safeStorage` API for credentials. Encrypt IndexedDB data containing PHI.
- **Encryption in transit**: TLS 1.2+ mandatory.
- **Access controls**: Implement session timeout, re-authentication for sensitive operations.
- **Audit logging**: Log all PHI access events.
- **BAA**: Your push notification service (FCM/APNs) must sign a BAA if push payloads contain PHI. Better: send content-free notifications ("You have a new message") and let the app fetch PHI over an authenticated API.

### PCI-DSS

If handling payment card data:
- **Never cache card numbers** in SW cache or IndexedDB.
- **CSP** must prevent script injection.
- **Electron**: Disable DevTools in production (`win.webContents.on('devtools-opened', () => win.webContents.closeDevTools())`).
- **iframes**: Use tokenized payment forms (Stripe Elements, etc.) loaded in sandboxed iframes.

---

## Security Checklist

```
PWA:
□ CSP header set (no unsafe-eval, minimal unsafe-inline)
□ HTTPS everywhere (including all subresources)
□ HSTS enabled with preload
□ SW served with Cache-Control: no-cache
□ SW validates fetch responses before caching
□ SW kill switch documented and tested
□ No sensitive data in push notification payloads
□ IndexedDB data encrypted if containing PII/PHI

Electron:
□ nodeIntegration: false, contextIsolation: true, sandbox: true
□ All IPC inputs validated with schema (Zod)
□ No arbitrary path access (allowlist directories)
□ Navigation restricted to known URLs
□ New window creation blocked (opens external browser)
□ Auto-updater uses HTTPS + signed releases
□ DevTools disabled in production builds
□ Code signed for macOS + Windows
□ Dependencies audited in CI
□ Electron version current (within 2 minor versions)
```

---
*Intinc Engineering — Security Hardening v2.0*
