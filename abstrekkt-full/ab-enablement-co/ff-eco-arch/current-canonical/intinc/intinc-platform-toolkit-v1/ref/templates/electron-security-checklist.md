# Electron Security Checklist

## Window Configuration
- [ ] contextIsolation: true
- [ ] nodeIntegration: false
- [ ] sandbox: true
- [ ] webSecurity: true
- [ ] allowRunningInsecureContent: false

## IPC Security
- [ ] All IPC uses invoke/handle (not send/on for two-way)
- [ ] Input validation on all IPC handlers (zod or similar)
- [ ] No raw file paths from renderer — use dialog API
- [ ] Preload script uses contextBridge only

## Content Security
- [ ] CSP header set on all pages
- [ ] External navigation blocked (will-navigate handler)
- [ ] New window creation blocked (setWindowOpenHandler)
- [ ] No remote module usage
- [ ] No eval() or new Function()

## Distribution
- [ ] Code signing enabled (macOS + Windows)
- [ ] Auto-update configured with signature verification
- [ ] Hardened runtime (macOS)
- [ ] ASAR packaging enabled
- [ ] No sensitive data in packaged files

## Update Security
- [ ] Updates served over HTTPS
- [ ] Update signatures verified
- [ ] Rollback strategy defined
- [ ] Update channel separation (stable/beta)
