$Root = "C:\Users\kyler\Downloads\NLM_PIPELINE"
$folders = @(
  "00_raw", "01_deduped", "02_ocr", "02_ocr\txt", "02_ocr\docx", "03_transcripts",
  "04_visual_extractions", "05_summaries", "06_concepts", "07_graphs", "08_flashfusion_mapping",
  "09_company_brain_ingest", "10_qa", "_skip_duplicates"
)
foreach ($folder in $folders) {
  $path = Join-Path $Root $folder
  if (!(Test-Path $path)) { New-Item -ItemType Directory -Path $path -Force | Out-Null }
}
Write-Host "NotebookLM pipeline folders created at $Root"
