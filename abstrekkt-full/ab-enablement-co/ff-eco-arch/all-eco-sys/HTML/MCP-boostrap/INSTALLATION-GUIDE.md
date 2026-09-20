# MCP Bootstrap Deliverables - Installation Guide

## 📦 What's Included

Your zip file contains:

### 1. GitHub Copilot Custom Agent
- **Path:** `github-copilot/.github/agents/source-of-truth.agent.md`
- **Purpose:** Production-ready code assistant with security-first patterns
- **Stack:** Next.js 15, TypeScript, Supabase, tRPC, Stripe
- **Features:**
  - OWASP Top 10 enforcement
  - Row Level Security (RLS) patterns
  - Type-safe API patterns
  - Code review checklist
  - Anti-patterns to avoid

### 2. Secure MCP System
Complete security remediation toolkit with:

**PowerShell Modules:**
- `SecretStore.psm1` - Windows Credential Manager integration

**Scripts:**
- `secure-mcp-remediation.ps1` - Automated migration script
- `Load-McpSecrets.ps1` - Runtime secret loader

**Configuration Files:**
- Claude: `configs/claude/mcp-config.json`
- Copilot: `configs/copilot/mcp-config.json`
- Gemini: `configs/gemini/settings.json`
- Codex: `configs/codex/setup-mcp-secure.ps1`

**Documentation:**
- User guide with daily usage, secret rotation, troubleshooting
- Security audit report (7 critical flaws identified + fixes)
- Incident report template

---

## 🚀 Installation Steps

### Step 1: Extract Archive
```powershell
# Extract to temporary location
Expand-Archive mcp-bootstrap-deliverables.zip -DestinationPath C:\temp
cd C:\temp\mcp-bootstrap-deliverables
```

### Step 2: Review Documentation
```powershell
# Read the main README
notepad README.md

# Review security audit
notepad secure-mcp-system\docs\bootstrap-audit-report.md
```

### Step 3: Run Remediation (If Needed)
If you have existing plain text secrets:
```powershell
# Dry run first (no changes)
cd secure-mcp-system\scripts
.\secure-mcp-remediation.ps1 -DryRun

# Execute remediation
.\secure-mcp-remediation.ps1
```

### Step 4: Install GitHub Copilot Agent
```powershell
# Copy to your repository
Copy-Item -Recurse github-copilot\.github C:\path\to\your\repo\
```

GitHub Copilot will automatically detect and activate the agent.

### Step 5: Deploy MCP Configurations
```powershell
# Claude
Copy-Item secure-mcp-system\configs\claude\mcp-config.json $env:USERPROFILE\.claude\

# Copilot
Copy-Item secure-mcp-system\configs\copilot\mcp-config.json $env:USERPROFILE\.copilot\

# Gemini
Copy-Item secure-mcp-system\configs\gemini\settings.json $env:USERPROFILE\.gemini\

# Codex (run setup script)
secure-mcp-system\configs\codex\setup-mcp-secure.ps1
```

### Step 6: Verify Installation
```powershell
# Test each CLI
claude --version
copilot --version
gemini --version
codex mcp list

# Check secrets
Import-Module "$env:USERPROFILE\.ai-cli-secrets\SecretStore.psm1"
Get-AllSecureSecrets -Category "mcp"
```

---

## ⚡ Quick Commands

### Add New Secret
```powershell
Import-Module "$env:USERPROFILE\.ai-cli-secrets\SecretStore.psm1"
Set-SecureSecret -Name "MY_API_KEY" -Value "your-key-here" -Category "mcp"
```

### Rotate Secret
```powershell
Import-Module "$env:USERPROFILE\.ai-cli-secrets\SecretStore.psm1"
Set-SecureSecret -Name "GITHUB_PERSONAL_ACCESS_TOKEN" -Value "new-token" -Category "mcp"
```

### Backup Secrets
```powershell
Import-Module "$env:USERPROFILE\.ai-cli-secrets\SecretStore.psm1"
$Secrets = @{}
Get-AllSecureSecrets -Category "mcp" | ForEach-Object {
    $Secrets[$_] = Get-SecureSecret -Name $_ -Category "mcp"
}
$Backup = $Secrets | ConvertTo-Json | ConvertTo-SecureString -AsPlainText -Force | ConvertFrom-SecureString
$Backup | Out-File "$env:USERPROFILE\.ai-cli-secrets\backup-$(Get-Date -Format 'yyyyMMdd').txt"
```

### Check Audit Log
```powershell
Get-Content "$env:USERPROFILE\.ai-cli-secrets\audit.jsonl" | ConvertFrom-Json | Format-Table
```

---

## 📋 Post-Installation Checklist

- [ ] All files extracted
- [ ] Documentation reviewed
- [ ] Remediation script tested (dry run)
- [ ] Remediation executed (if needed)
- [ ] GitHub Copilot agent installed
- [ ] MCP configs deployed
- [ ] All CLIs tested
- [ ] Secrets verified in Credential Manager
- [ ] Audit log checked
- [ ] Secret rotation scheduled (quarterly)

---

## 🔒 Security Reminders

1. **Secrets are per-user, per-machine**
   - Not portable between Windows accounts
   - Backup before reinstalling Windows

2. **Rotate quarterly (90 days)**
   - Set calendar reminders
   - Document rotation in audit log

3. **Never share**
   - Don't screenshot Credential Manager
   - Don't email secret backups
   - Use secure sharing (1Password, etc.)

4. **Monitor audit log**
   - Review weekly: `audit.jsonl`
   - Check for unauthorized access
   - Verify rotation dates

---

## 📞 Support

**Documentation:**
- Main README: `README.md`
- User Guide: `secure-mcp-system/docs/README.md`
- Audit Report: `secure-mcp-system/docs/bootstrap-audit-report.md`

**Troubleshooting:**
1. Check `docs/README.md` troubleshooting section
2. Review audit log for errors
3. Run remediation with `-DryRun` to diagnose
4. Contact security team if compromise suspected

---

## 🎯 Success Indicators

System is properly configured when:
- ✅ No plain text secrets on disk
- ✅ All secrets in Windows Credential Manager
- ✅ All 4 CLIs working
- ✅ Audit log present
- ✅ PowerShell history clean
- ✅ Backups encrypted
- ✅ Quarterly rotation scheduled

---

**Questions?** Review the comprehensive documentation in the `docs/` folder.

**Generated:** January 19, 2026  
**Version:** 1.0
