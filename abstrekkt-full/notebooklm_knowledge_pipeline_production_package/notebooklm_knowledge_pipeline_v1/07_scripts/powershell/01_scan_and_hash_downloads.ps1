param(
  [string]$DownloadsPath = "C:\Users\kyler\Downloads",
  [string]$OutputPath = "C:\Users\kyler\Downloads\NLM_PIPELINE\10_qa\hash_manifest.csv"
)

$ErrorActionPreference = "Stop"
$allowed = @(".pdf", ".png", ".m4a", ".mp4")
$items = Get-ChildItem -Path $DownloadsPath -File | Where-Object { $allowed -contains $_.Extension.ToLower() }
$rows = foreach ($item in $items) {
  $hash = Get-FileHash -Path $item.FullName -Algorithm SHA256
  [PSCustomObject]@{
    FileName = $item.Name
    Extension = $item.Extension.ToLower()
    SizeBytes = $item.Length
    SHA256 = $hash.Hash
    FullPath = $item.FullName
    ScannedAt = (Get-Date).ToString("s")
  }
}

$dir = Split-Path $OutputPath
if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$rows | Sort-Object Extension, FileName | Export-Csv -Path $OutputPath -NoTypeInformation
Write-Host "Hash manifest written to $OutputPath"

$dupes = $rows | Group-Object SHA256 | Where-Object { $_.Count -gt 1 }
if ($dupes.Count -gt 0) {
  Write-Host "Potential duplicates found:"
  $dupes | ForEach-Object { $_.Group | Select-Object FileName, SizeBytes, SHA256 | Format-Table }
} else {
  Write-Host "No exact SHA-256 duplicates found."
}
