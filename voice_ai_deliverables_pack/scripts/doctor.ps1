$ErrorActionPreference = "Stop"

Write-Host "== Claude Code CLI Doctor (non-destructive) =="
Write-Host ("Date: {0}" -f (Get-Date))
Write-Host ("PWD:  {0}" -f (Get-Location))
Write-Host ("User: {0}" -f $env:USERNAME)
Write-Host ""

Write-Host "== Tools =="
function Print-Tool($name, $cmd) {
  $p = Get-Command $cmd -ErrorAction SilentlyContinue
  if ($null -eq $p) {
    Write-Host ("{0}: NOT FOUND" -f $name)
  } else {
    try {
      $out = & $cmd --version 2>$null
      Write-Host ("{0}: {1}" -f $name, $out)
    } catch {
      Write-Host ("{0}: FOUND (version unavailable)" -f $name)
    }
  }
}

Print-Tool "git" "git"
Print-Tool "node" "node"
Print-Tool "python" "python"
Print-Tool "claude" "claude"
Write-Host ""

Write-Host "== Filesystem write test (local .\\.tmp only) =="
$tmpDir = Join-Path (Get-Location) ".tmp\claude_doctor"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null
$testFile = Join-Path $tmpDir "write_test.txt"
"ok $(Get-Date)" | Out-File -FilePath $testFile -Encoding utf8
Write-Host ("Wrote: {0}" -f $testFile)
Write-Host "Read back:"
Get-Content $testFile
Write-Host ""

Write-Host "== Permissions snapshot =="
Get-ChildItem $tmpDir | Format-Table -AutoSize
Write-Host ""
Write-Host "Doctor completed successfully."
