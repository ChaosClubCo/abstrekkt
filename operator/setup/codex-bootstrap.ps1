[CmdletBinding()]
param(
    [switch]$InstallOpenDesign,
    [switch]$InstallChronos,
    [switch]$VerifyOnly
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Require-Command {
    param([Parameter(Mandatory)][string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found on PATH."
    }
}

function Invoke-Checked {
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [Parameter(Mandatory)][string[]]$ArgumentList
    )
    & $FilePath @ArgumentList
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code $LASTEXITCODE: $FilePath $($ArgumentList -join ' ')"
    }
}

Require-Command 'codex.cmd'

Write-Host 'Codex:'
Invoke-Checked 'codex.cmd' @('--version')

if (-not $VerifyOnly) {
    if ($InstallOpenDesign) {
        Require-Command 'od'
        Write-Host 'Installing Open Design MCP entry into Codex...'
        Invoke-Checked 'od' @('mcp', 'install', 'codex')
    }

    if ($InstallChronos) {
        Write-Host 'Installing Chronos from its Git marketplace fallback...'
        # Do not also install the Directory copy. Chronos documents the two
        # sources as distinct identities and warns against duplicate installs.
        Invoke-Checked 'codex.cmd' @('plugin', 'marketplace', 'add', 'FaxanFM/chronos')
        Invoke-Checked 'codex.cmd' @('plugin', 'add', 'chronos@chronos')
    }
}

Write-Host 'Verification:'

if (Get-Command 'od' -ErrorAction SilentlyContinue) {
    Write-Host 'Open Design CLI is present.'
} else {
    Write-Warning 'Open Design CLI is not present; OD MCP installation cannot be verified.'
}

if (Get-Command 'chronos.cmd' -ErrorAction SilentlyContinue) {
    Invoke-Checked 'chronos.cmd' @('-Action', 'install-status')
} else {
    Write-Warning 'chronos.cmd is not present; Chronos installation cannot be verified.'
}

Write-Host 'After any Open Design or Chronos install/upgrade, fully quit Codex, reopen it, and start a fresh task before runtime verification.'
Write-Host 'Chronos verification prompt: Set up Chronos: verify source, create one Governor, explain hooks, and prove Heartbeat coverage and zero worker recurrences.'
