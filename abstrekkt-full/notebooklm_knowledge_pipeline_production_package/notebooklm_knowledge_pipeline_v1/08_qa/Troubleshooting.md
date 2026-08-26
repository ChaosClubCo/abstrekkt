# Troubleshooting Guide

| Problem | Cause | Fix | Retry check |
|---|---|---|---|
| Google Doc OCR is blank | Low contrast or image compression | Try Adobe OCR or local OCR | Search for page 1 title |
| OCR text order is scrambled | Multi-column slide layout | Rechunk manually by page/section | Compare against visible slide |
| Whisper fails | CLI not installed or path issue | Install Whisper and confirm `whisper --help` | Run on one small MP4 |
| Transcript has no timestamps | Wrong output format | Use `--output_format all` | Confirm SRT/VTT exists |
| Duplicate files keep appearing | `(1)` copies not moved | Use SHA-256 manifest and skip folder | Rerun hash script |
| Concepts are duplicated | No ontology normalization | Map aliases to canonical terms | Review Master_Ontology |
| Agent gives uncited answers | Provenance not attached | Require provenance record per claim | Test source-backed answer |
| Supabase RLS blocks ingestion | Using anon key or strict policy | Use service role only from server-side environment | Confirm insert succeeds |
| Secrets appear in source docs | Raw exports contain credentials | Quarantine and sanitize before ingestion | Run manual security review |
