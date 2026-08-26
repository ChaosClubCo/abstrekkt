param(
  [string]$InputPath = "C:\Users\kyler\Downloads\NLM_PIPELINE\01_deduped",
  [string]$OutputPath = "C:\Users\kyler\Downloads\NLM_PIPELINE\03_transcripts",
  [string]$Model = "medium"
)

$ErrorActionPreference = "Stop"
if (!(Get-Command whisper -ErrorAction SilentlyContinue)) {
  throw "Whisper CLI not found. Install faster-whisper or openai-whisper before running this script."
}
if (!(Test-Path $OutputPath)) { New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null }

$media = Get-ChildItem -Path $InputPath -Recurse -File | Where-Object { $_.Extension.ToLower() -in @(".m4a", ".mp4") }
foreach ($file in $media) {
  Write-Host "Transcribing $($file.Name)..."
  whisper $file.FullName --model $Model --language en --output_format all --output_dir $OutputPath
}
Write-Host "Transcription batch complete."
